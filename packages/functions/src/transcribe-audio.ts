import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { DynamoDBClient, UpdateItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";
import axios from 'axios';
import { Config } from "sst/node/config";
import FormData from "form-data";
import { Table } from "sst/node/table";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import * as model from "../../../model";

const OPENAI_API_ENDPOINT = 'https://api.openai.com/v1/audio/transcriptions';
const openaiKey = Config.OPENAI_API_KEY;

export async function handler(event: S3Event) {
    for (const record of event.Records) {
        const bucket = record.s3.bucket.name;
        const key = record.s3.object.key;

        const s3 = new S3Client({});
        const getObjectOutput = await s3.send(new GetObjectCommand({
            Bucket: bucket,
            Key: key
        }));

        console.log('Transcribing audio');

        const formData = new FormData();
        formData.append('file', getObjectOutput.Body, {
            filename: key.split('/').pop(),
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

        const dynamo = new DynamoDBClient({});
        const userId = key.split('/')[0];
        const interviewId = key.split('/')[1];
        const questionIndex = parseInt(key.split('/')[2].split("_")[1]);
        const interview = await dynamo.send(new GetItemCommand({
            TableName: Table.interviews.tableName,
            Key: marshall({
                userId,
                interviewId,
            }),
        }));

        if (!interview.Item) {
            console.error('No interview found with id', interviewId);
            return;
        }

        const interviewData = unmarshall(interview.Item) as model.Interview;
        interviewData.questions[questionIndex].answer = response.data;

        // update the item
        await dynamo.send(new UpdateItemCommand({
            TableName: Table.interviews.tableName,
            Key: marshall({
                userId,
                interviewId,
            }),
            UpdateExpression: 'SET questions = :questions',
            ExpressionAttributeValues: marshall({
                ':questions': interviewData.questions
            }),
        }));
    }
}

interface S3Event {
    Records: {
        eventVersion: string;
        eventSource: string;
        awsRegion: string;
        eventTime: string;
        eventName: string;
        userIdentity: {
            principalId: string;
        };
        requestParameters: {
            sourceIPAddress: string;
        };
        responseElements: {
            "x-amz-request-id": string;
            "x-amz-id-2": string;
        };
        s3: {
            s3SchemaVersion: string;
            configurationId: string;
            bucket: {
                name: string;
                ownerIdentity: {
                    principalId: string;
                };
                arn: string;
            };
            object: {
                key: string;
                size: number;
                eTag: string;
                sequencer: string;
            };
        };
    }[];
}