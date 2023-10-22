import OpenAI from "openai";
import { Config } from "sst/node/config";
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { Table } from "sst/node/table";

const openaiKey = Config.OPENAI_API_KEY;

// lambda event bridge event
export async function handler(event: any, context: any, callback: any) {
    console.log("Got event from eventbridge");

    const { interviewId, userId, prompt, schema } = event.detail;

    const openaiClient = new OpenAI({
        apiKey: openaiKey
    });

    console.log("Calling OpenAI API");
    const gptResponse = await openaiClient.chat.completions.create({
        model: "gpt-4-0613",
        messages: [
            { role: "system", content: "You are a job interviewer." },
            { role: "user", content: prompt }
        ],
        functions: [{ name: "generate_interview", parameters: schema }],
        function_call: { name: "generate_interview" }
    });

    console.log("Got OpenAI response");

    const gptData = gptResponse.choices[0].message.function_call?.arguments;
    if (!gptData) {
        console.log("No GPT data");
        return;
    }

    const gptJson = JSON.parse(gptData);

    // add questions to interview in table
    const dynamodb = new DynamoDBClient({});
    await dynamodb.send(new UpdateItemCommand({
        TableName: Table.interviews.tableName,
        Key: marshall({
            interviewId: interviewId,
            userId: userId,
        }),
        UpdateExpression: "SET #questions = :questions, #status = :status",
        ExpressionAttributeNames: {
            "#questions": "questions",
            "#status": "status",
        },
        ExpressionAttributeValues: marshall({
            ":questions": gptJson.questions,
            ":status": "QUESTIONS_GENERATED",
        }),
    }));

    console.log("Updated interview in table");
}

interface EventBridgeEvent {
    version: string;
    id: string;
    "detail-type": string;
    source: string;
    account: string;
    time: string;
    region: string;
    resources: string[];
    detail: {
        interviewId: string;
        userId: string;
        prompt: string;
        schema: any;
    };
}