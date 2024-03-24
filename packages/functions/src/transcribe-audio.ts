import { DynamoDBClient, UpdateItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";
import axios from 'axios';
import { Config } from "sst/node/config";
import FormData from "form-data";
import { Table } from "sst/node/table";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import * as model from "../../../model";
import { ApiHandler } from "sst/node/api";
import { useSession } from "sst/node/auth";
import * as parser from 'lambda-multipart-parser';

const OPENAI_API_ENDPOINT = 'https://api.openai.com/v1/audio/transcriptions';
const openaiKey = Config.OPENAI_API_KEY;

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

    const dynamo = new DynamoDBClient({});

    const userRes = await dynamo.send(new GetItemCommand({
        TableName: Table.users.tableName,
        Key: marshall({
            userId: session.properties.userID,
        })
    }));

    if (!userRes.Item) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "User not found",
                event,
            }),
        }
    }

    const user = unmarshall(userRes.Item) as model.UserSession;

    const body = await parser.parse(event as any);
    const { files, ...fields } = body;

    if (!files || !files[0] || !files[0].content) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "No audio file found",
                event,
            }),
        }
    }

    const { interviewId, questionIndex, start, end } = fields;

    if (!interviewId || !questionIndex) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Missing interviewId or questionIndex",
                event,
            }),
        }
    }

    console.log('Transcribing audio');

    // get interview from table
    const interviewRes = await dynamo.send(new GetItemCommand({
        TableName: Table.interviews.tableName,
        Key: marshall({
            userId: user.userId,
            interviewId: fields.interviewId,
        })
    }));

    if (!interviewRes.Item || !interviewRes.Item) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Interview not found",
                event,
            }),
        }
    }

    const interview = unmarshall(interviewRes.Item) as model.Interview;

    if (!interview.questions[parseInt(fields.questionIndex)]) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Question not found",
                event,
            }),
        }
    }

    if (interview.questions[parseInt(fields.questionIndex)].answer) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Question already answered",
                event,
            }),
        }
    }


    if (interview.status !== model.InterviewStatus.IN_PROGRESS) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Interview not in progress",
                event,
            }),
        }
    }

    const formData = new FormData();
    formData.append('file', files[0].content, {
        filename: files[0].filename,
        contentType: 'audio/wav',
    });
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'text');

    const response = await axios.post(OPENAI_API_ENDPOINT, formData, {
        headers: {
            'Authorization': `Bearer ${openaiKey}`,
            'Content-Type': 'multipart/form-data',
        },
    });

    console.log('Transcribed audio');

    const index = parseInt(fields.questionIndex);
    interview.questions[index].answer = response.data;
    if (start && end) {
        interview.questions[index].start = parseInt(start);
        interview.questions[index].end = parseInt(end);
    }

    // update the item
    await dynamo.send(new UpdateItemCommand({
        TableName: Table.interviews.tableName,
        Key: marshall({
            userId: user.userId,
            interviewId,
        }),
        UpdateExpression: 'SET questions = :questions',
        ExpressionAttributeValues: marshall({
            ':questions': interview.questions
        }),
    }));

    return {
        statusCode: 200,
        body: JSON.stringify({
            answer: response.data,
        }),
    }
});