import { AuthHandler, GoogleAdapter, Session } from "sst/node/auth";
import { DynamoDBClient, GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { Table } from "sst/node/table";
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { StaticSite } from "sst/node/site";
import * as model from "../../../model";

const GOOGLE_CLIENT_ID =
    "225195733955-jljq8n1edsu33hvkllm050hu9h9h34vi.apps.googleusercontent.com";

export const handler = AuthHandler({
    providers: {
        google: GoogleAdapter({
            mode: "oidc",
            clientID: GOOGLE_CLIENT_ID,
            onSuccess: async (tokenset) => {
                const claims = tokenset.claims();

                const ddbClient = new DynamoDBClient({});

                let item = {
                    userId: claims.sub,
                    email: claims.email,
                    picture: claims.picture,
                    name: claims.given_name
                } as model.UserSession;

                // Check if the user already exists
                const existingUser = await ddbClient.send(new GetItemCommand({
                    TableName: Table.users.tableName,
                    Key: {
                        userId: { S: claims.sub }
                    }
                }));

                // If user doesn't exist, add a credit field
                if (!existingUser.Item) {
                    item.credits = 1;
                } else {
                    item = { ...unmarshall(existingUser.Item), ...item };
                }


                await ddbClient.send(new PutItemCommand({
                    TableName: Table.users.tableName,
                    Item: marshall(item)
                }));

                return Session.parameter({
                    redirect: process.env.IS_LOCAL ? "http://localhost:5173/" : `${StaticSite.site.url}/}`,
                    type: "user",
                    properties: {
                        userID: claims.sub,
                    }
                });
            },
        }),
    },
});

declare module "sst/node/auth" {
    export interface SessionTypes {
        user: {
            userID: string;
        };
    }
}
