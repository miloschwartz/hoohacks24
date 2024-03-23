import { Auth, StaticSite, Api, Table } from "sst/constructs";

export function MainStack({ stack }: any) {
  const userTable = new Table(stack, "users", {
    fields: {
      userId: "string",
    },
    primaryIndex: { partitionKey: "userId" },
  });

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        bind: [userTable],
      },
    },
    routes: {
      "GET /": "packages/functions/src/auth.handler",
      "GET /session": "packages/functions/src/session.handler",
      "POST /ocr": "packages/functions/src/ocr.handler",
    },
  });

  const site = new StaticSite(stack, "site", {
    path: "web",
    buildCommand: "npm run build",
    buildOutput: "dist",
    environment: {
      VITE_APP_API_URL: api.url,
    },
  });

  const auth = new Auth(stack, "auth", {
    authenticator: {
      handler: "packages/functions/src/auth.handler",
      bind: [site],
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
