import { StackContext, Auth, StaticSite, Api, Table, Config, EventBus, WebSocketApi } from "sst/constructs";

export function MainStack({ stack }: any) {
    const OPENAI_API_KEY = new Config.Secret(stack, "OPENAI_API_KEY");

    const userTable = new Table(stack, "users", {
        fields: {
            userId: "string",
        },
        primaryIndex: { partitionKey: "userId" },
    });

    const connectionsTable = new Table(stack, "ws-connections", {
        fields: {
            connectionId: "string",
            subId: "string",
        },
        primaryIndex: { partitionKey: "connectionId", sortKey: "subId" },
        globalIndexes: {
            subId: { partitionKey: "subId", sortKey: "connectionId" },
        }
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
            created: { partitionKey: "userId", sortKey: "created" },
        },
        stream: true,
    });

    const eventBus = new EventBus(stack, "bus", {
        rules: {
            "generate-questions": {
                pattern: { source: ["create-interview"] },
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
            },
            "generate-feedback": {
                pattern: { source: ["finish-interview"] },
                targets: {
                    "generate-feedback": {
                        function: {
                            handler: "packages/functions/src/generate-feedback.handler",
                            bind: [OPENAI_API_KEY, interviewTable, userTable],
                            permissions: ["dynamodb:*"],
                            timeout: 600,
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
        routes: {
            "GET /": "packages/functions/src/auth.handler",
            "GET /session": "packages/functions/src/session.handler",
            "POST /create-interview": {
                function: {
                    handler: "packages/functions/src/create-interview.handler",
                    permissions: ["textract:*"],
                    timeout: 60,
                }
            },
            "GET /get-interview/{interviewId}": "packages/functions/src/get-interview.handler",
            "GET /get-interviews": "packages/functions/src/get-interviews.handler",
            "POST /transcribe-audio": {
                function: {
                    handler: "packages/functions/src/transcribe-audio.handler",
                    bind: [OPENAI_API_KEY],
                    timeout: 240,
                }
            },
            "POST /begin-interview/{interviewId}": "packages/functions/src/begin-interview.handler",
            "POST /add-answer/{interviewId}": "packages/functions/src/add-answer.handler",
            "POST /finish-interview/{interviewId}": "packages/functions/src/finish-interview.handler",
        },
    });

    const websocket = new WebSocketApi(stack, "websocket", {
        defaults: {
            function: {
                bind: [userTable, interviewTable, connectionsTable],
            },
        },
        routes: {
            $connect: "packages/functions/src/ws-connect.main",
            $disconnect: "packages/functions/src/ws-disconnect.main",
        },
    });

    interviewTable.addConsumers(stack, {
        "stream-interview": {
            function: {
                handler: "packages/functions/src/stream-interview.handler",
                bind: [websocket, connectionsTable],
                permissions: ["execute-api:*"],
            }
        }
    });

    const site = new StaticSite(stack, "site", {
        path: "web",
        buildCommand: "npm run build",
        buildOutput: "dist",
        customDomain: "proficioai.co",
        environment: {
            VITE_WEBSOCKET_ENDPOINT: websocket.url,
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
        WebSocketEndpoint: websocket.url,
        SiteURL: site.url,
    });
}
