import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
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

    const ddb = new DynamoDBClient({});
    // query on user id index
    const data = await ddb.send(new QueryCommand({
        TableName: Table.interviews.tableName,
        IndexName: "userId",
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: marshall({
            ":userId": session.properties.userID,
        }),
    }));

    if (!data.Items) {
        return {
            statusCode: 404,
            body: JSON.stringify({
                message: "Unable to get interviews",
                event,
            }),
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            interviews: data.Items.map((item) => unmarshall(item)),
        }),
    }
});
