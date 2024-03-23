import { AuthHandler, GoogleAdapter, Session } from "sst/node/auth";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { Table } from "sst/node/table";
import { marshall } from "@aws-sdk/util-dynamodb";
import { StaticSite } from "sst/node/site";

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
                await ddbClient.send(new PutItemCommand({
                    TableName: Table.users.tableName,
                    Item: marshall({
                        userId: claims.sub,
                        email: claims.email,
                        picture: claims.picture,
                        name: claims.given_name,
                        credits: 1
                    })
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
