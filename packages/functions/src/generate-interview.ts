import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { TextractClient, AnalyzeDocumentCommand } from "@aws-sdk/client-textract";
import * as parser from "lambda-multipart-parser";
import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";
import { EventBus } from "sst/node/event-bus";
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import * as uuid from "uuid";
import { Table } from "sst/node/table";
import { useSession } from "sst/node/auth";
import { ApiHandler } from "sst/node/api";
import { marshall } from "@aws-sdk/util-dynamodb";

export const handler = ApiHandler(async (event) => {
    const session = useSession();

    // Check user is authenticated
    if (session.type !== "user") {
        return {
            statusCode: 401,
            body: JSON.stringify({
                message: "Not authenticated",
                event,
            }),
        }
    }

    const body = await parser.parse(event as any);
    const { files, ...fields } = body;

    let uploadedResume = false;
    if (files && files[0] && files[0].content) {
        uploadedResume = true;
    }

    if (!fields.jobTitle || !fields.jobDescription || !fields.interviewType) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Missing required fields",
                event,
            }),
        }
    }

    let resumeText = "";
    if (uploadedResume) {
        const textract = new TextractClient({});
        const ocrRes = await textract.send(new AnalyzeDocumentCommand({
            Document: {
                Bytes: body.files[0].content,
            },
            FeatureTypes: ["FORMS"],
        }));
        ocrRes.Blocks?.forEach(block => {
            if (block.BlockType === "LINE" && block.Text) {
                resumeText += block.Text + "\n";
            }
        });
    }

    console.log("Got resume text");

    let prompt = "Return a list of 7 questions to ask a candidate for a " + fields.jobTitle + " position. The job description is as follows: " + fields.jobDescription + ". The interview type is " + fields.interviewType + ".";
    if (uploadedResume) {
        prompt = + " The candidate's resume is as follows: " + resumeText + ".";
    }
    if (fields.interviewType === "Behavioral") {
        prompt += " The interview should be behavioral so try to tailor some of the questions to the candidates resume.";
    }
    if (fields.interviewType === "Technical") {
        prompt += " The interview should be technical so try to tailor some of the questions to the job qualifications if possible.";
    }
    const schema = {
        type: "object",
        properties: {
            questions: {
                type: "array",
                description: "A list of questions to ask the candidate",
                items: {
                    type: "string"
                }
            }
        }
    }

    const interviewId = uuid.v4();
    const payload = {
        interviewId: interviewId,
        userId: session.properties.userID,
        prompt,
        schema
    };

    // add record to table
    const dynamo = new DynamoDBClient({});
    await dynamo.send(new PutItemCommand({
        TableName: Table.interviews.tableName,
        Item: marshall({
            interviewId: interviewId,
            userId: session.properties.userID,
            created: new Date().toISOString(),
            status: "GENERATING_QUESTIONS",
        })
    }));

    // send over eventbridge
    const eventBridge = new EventBridgeClient({});
    await eventBridge.send(new PutEventsCommand({
        Entries: [
            {
                EventBusName: EventBus.bus.eventBusName,
                Source: "generate-interview",
                DetailType: "generate-interview",
                Detail: JSON.stringify(payload),
            }
        ]
    }));

    console.log("Sent event to eventbridge");

    return {
        statusCode: 200,
        body: JSON.stringify({
            interviewId
        }),
    }
});
