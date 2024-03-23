import { APIGatewayProxyHandler } from "aws-lambda";
import { Table } from "sst/node/table";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

export const main: APIGatewayProxyHandler = async (event) => {

    const query = event.queryStringParameters

    if (!query || !query.subId) {
        return { statusCode: 400, body: "Missing subId" };
    }

    try {
        const ddbClient = new DynamoDBClient({});
        await ddbClient.send(new PutItemCommand({
            TableName: Table['ws-connections'].tableName,
            Item: marshall({
                connectionId: event.requestContext.connectionId,
                subId: query.subId,
                connectionTime: Date.now(),
            })
        }));
    } catch (err) {
        console.error(err);
        return { statusCode: 500, body: "Failed to create susbcription" };
    }

    return { statusCode: 200, body: "Connected" };
};