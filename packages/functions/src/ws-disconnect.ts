import { APIGatewayProxyHandler } from "aws-lambda";
import { Table } from "sst/node/table";
import { DynamoDBClient, DeleteItemCommand, QueryCommand, BatchWriteItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

export const main: APIGatewayProxyHandler = async (event) => {
    try {
        // query all items with connectionId
        // batch delete those items 
        const ddbClient = new DynamoDBClient({});
        const res = await ddbClient.send(new QueryCommand({
            TableName: Table['ws-connections'].tableName,
            KeyConditionExpression: "connectionId = :connectionId",
            ExpressionAttributeValues: marshall({
                ":connectionId": event.requestContext.connectionId
            })
        }));

        if (!res.Items) {
            return { statusCode: 200, body: "Disconnected" };
        }

        await ddbClient.send(new BatchWriteItemCommand({
            RequestItems: {
                [Table['ws-connections'].tableName]: res.Items.map(item => ({
                    DeleteRequest: {
                        Key: item
                    }
                }))
            }
        }));
    } catch (err) {
        console.error(err);
        return { statusCode: 500, body: "Failed to disconnect subscription" };
    }

    return { statusCode: 200, body: "Disconnected" };
};