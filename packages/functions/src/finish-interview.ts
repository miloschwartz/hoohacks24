import { DynamoDBClient, UpdateItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { Table } from "sst/node/table";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import * as model from "../../../model";
import { ApiHandler } from "sst/node/api";
import { useSession } from "sst/node/auth";

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
    const body = JSON.parse(event.body || "{}");
    if (!event.pathParameters || !event.pathParameters.interviewId) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Missing required fields",
                event,
            }),
        }
    }

    // get interview from table
    const interviewRes = await dynamo.send(new GetItemCommand({
        TableName: Table.interviews.tableName,
        Key: marshall({
            userId: user.userId,
            interviewId: event.pathParameters.interviewId,
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

    if (interview.status !== model.InterviewStatus.IN_PROGRESS) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Interview not in progress",
                event,
            }),
        }
    }


    interview.status = model.InterviewStatus.COMPLETED;

    // update the item
    await dynamo.send(new UpdateItemCommand({
        TableName: Table.interviews.tableName,
        Key: marshall({
            userId: user.userId,
            interviewId: event.pathParameters.interviewId,
        }),
        UpdateExpression: "SET #status = :status",
        ExpressionAttributeNames: {
            "#status": "status",
        },
        ExpressionAttributeValues: marshall({
            ":status": interview.status,
        }),
    }));


    return {
        statusCode: 200,
        body: JSON.stringify({
            success: true
        }),
    }
});