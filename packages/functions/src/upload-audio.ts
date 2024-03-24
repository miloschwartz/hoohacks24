import * as parser from "lambda-multipart-parser";
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import * as model from "../../../model";
import { Table } from "sst/node/table";
import { useSession } from "sst/node/auth";
import { ApiHandler } from "sst/node/api";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { Bucket } from "sst/node/bucket";

export const handler = ApiHandler(async (event) => {
    const session = useSession();
    const dynamo = new DynamoDBClient({});

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

    // get user from table
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

    if (user.credits < 1) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Not enough credits",
                event,
            }),
        }
    }

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

    const s3 = new S3Client({});
    const key = `${user.userId}/${fields.interviewId}/question_${fields.questionIndex}.wav`;
    const s3Res = await s3.send(new PutObjectCommand({
        Bucket: Bucket.audio.bucketName,
        Key: key,
        Body: files[0].content,
    }));
    if (s3Res.$metadata.httpStatusCode !== 200) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Error uploading audio",
                event,
            }),
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify({}),
    }
});
