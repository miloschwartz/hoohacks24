import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { ApiGatewayManagementApiClient, PostToConnectionCommand } from "@aws-sdk/client-apigatewaymanagementapi";
import { Table } from "sst/node/table";
import { WebSocketApi } from "sst/node/websocket-api";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

export async function handler(event: any) {
    const db = new DynamoDBClient({});
    let postCalls: Promise<any>[] = [];

    for (const record of event.Records) {
        let connections;

        try {
            // query all connections with subId
            const res = await db.send(new QueryCommand({
                TableName: Table['ws-connections'].tableName,
                KeyConditionExpression: "subId = :subId",
                IndexName: "subId",
                ExpressionAttributeValues: marshall({
                    ":subId": `${record.dynamodb.Keys.userId.S}::${record.dynamodb.Keys.interviewId.S}`
                })
            }));
            if (res.Items) {
                connections = res.Items;
            }
        } catch (err) {
            console.error(err);
            return { statusCode: 500, body: "Failed to query connections" };
        }

        const api = new ApiGatewayManagementApiClient({
            region: "us-east-1",
            endpoint: WebSocketApi.websocket.httpsUrl,
        });

        if (!connections) {
            return { statusCode: 200, body: "No connections found." };
        }

        console.log(`Found ${connections.length} connections.`);

        postCalls = [...postCalls, ...connections.map(async (item: any) => {
            const postCommand = new PostToConnectionCommand({
                ConnectionId: item.connectionId.S,
                Data: JSON.stringify(unmarshall(event.Records[0].dynamodb.NewImage || {}))
            });
            await api.send(postCommand);
        })];
    }

    try {
        await Promise.all(postCalls);
    } catch (e) {
        return { statusCode: 500, body: "Failed to post" };
    }

    return { statusCode: 200, body: 'Event sent.' };

}