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

    const queryParams = event.queryStringParameters;
    console.log("queryParams", queryParams);

    const params = {
        TableName: Table.interviews.tableName,
        IndexName: "created",
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: marshall({
            ":userId": session.properties.userID,
        }),
        ScanIndexForward: false,
    } as any;
    // if next token and limit is provided in params then use it
    if (queryParams && queryParams.nextToken) {
        const key = JSON.parse(queryParams.nextToken);
        params["ExclusiveStartKey"] = key;
    }

    if (queryParams && queryParams.limit) {
        params["Limit"] = parseInt(queryParams.limit);
    }

    const ddb = new DynamoDBClient({});
    const data = await ddb.send(new QueryCommand(params));



    if (!data.Items) {
        return {
            statusCode: 404,
            body: JSON.stringify({
                message: "Unable to get interviews",
                event,
            }),
        }
    }


    // return items and any next token
    return {
        statusCode: 200,
        body: JSON.stringify({
            items: data.Items.map((item) => unmarshall(item)),
            nextToken: data.LastEvaluatedKey ? JSON.stringify(data.LastEvaluatedKey) : null,
        }),
    }
});
