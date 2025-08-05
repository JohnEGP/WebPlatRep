import { Handler } from "@netlify/functions";
import serverlessHttp from "serverless-http";
import { createServer } from "../../server/index";

const app = createServer();
const handler = serverlessHttp(app);

export const netlifyHandler: Handler = async (event, context) => {
  // Remove the /.netlify/functions/api prefix from the path
  const path = event.path.replace(/^\/\.netlify\/functions\/api/, "") || "/";

  const modifiedEvent = {
    ...event,
    path,
    requestContext: {
      ...event.requestContext,
      path,
    },
  };

  const result = await handler(modifiedEvent, context);
  return result;
};

export { netlifyHandler as handler };
