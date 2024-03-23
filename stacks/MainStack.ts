import { StackContext, Auth, StaticSite, Api, Table, Bucket, Config, EventBus } from "sst/constructs";

export function MainStack({ stack }: any) {
    const OPENAI_API_KEY = new Config.Secret(stack, "OPENAI_API_KEY");

    const userTable = new Table(stack, "users", {
        fields: {
            userId: "string",
        },
        primaryIndex: { partitionKey: "userId" },
    });

    const interviewTable = new Table(stack, "interviews", {
        fields: {
            interviewId: "string",
            userId: "string",
            created: "string",
        },
        primaryIndex: { partitionKey: "interviewId", sortKey: "userId" },
        globalIndexes: {
            userId: { partitionKey: "userId", sortKey: "interviewId" },
        }
    });

    const eventBus = new EventBus(stack, "bus", {
        rules: {
            "generate-questions": {
                pattern: { source: ["generate-interview"] },
                targets: {
                    "generate-questions": {
                        function: {
                            handler: "packages/functions/src/generate-questions.handler",
                            bind: [OPENAI_API_KEY, interviewTable, userTable],
                            permissions: ["dynamodb:*"],
                            timeout: 240,
                        }
                    }
                }
            }
        }
    });

    const api = new Api(stack, "api", {
        defaults: {
            function: {
                bind: [userTable, interviewTable, eventBus]
            }
        },
        customDomain: "api.interviewsimulatorai.com",
        routes: {
            "GET /": "packages/functions/src/auth.handler",
            "GET /session": "packages/functions/src/session.handler",
            "POST /generate-interview": {
                function: {
                    handler: "packages/functions/src/generate-interview.handler",
                    permissions: ["textract:*", "eventbridge:*", "dynamodb:*"],
                    timeout: 60,
                }
            },
            "GET /get-interview/{interviewId}": "packages/functions/src/get-interview.handler",
            "GET /get-interviews": "packages/functions/src/get-interviews.handler",
        },
    });

    const site = new StaticSite(stack, "site", {
        path: "web",
        buildCommand: "npm run build",
        buildOutput: "dist",
        customDomain: "interviewsimulatorai.com",
        environment: {
            VITE_APP_API_URL: api.url,
        },
    });
    const auth = new Auth(stack, "auth", {
        authenticator: {
            handler: "packages/functions/src/auth.handler",
            bind: [site]
        },
    });
    auth.attach(stack, {
        api,
        prefix: "/auth",
    });
    stack.addOutputs({
        ApiEndpoint: api.url,
        SiteURL: site.url,
    });
}
