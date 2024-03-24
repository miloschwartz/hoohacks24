import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { Table } from "sst/node/table";
import { useSession } from "sst/node/auth";
import { ApiHandler } from "sst/node/api";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

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


    if (!event.pathParameters || !event.pathParameters.interviewId) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Missing required fields",
                event,
            }),
        }
    }

    const ddb = new DynamoDBClient({});
    const data = await ddb.send(
        new GetItemCommand({
            TableName: Table.interviews.tableName,
            Key: marshall({
                interviewId: event.pathParameters.interviewId,
                userId: session.properties.userID,
            }),
        })
    );

    if (!data.Item) {
        return {
            statusCode: 404,
            body: JSON.stringify({
                message: "Interview not found",
                event,
            }),
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify(unmarshall(data.Item!)),
    }
});
