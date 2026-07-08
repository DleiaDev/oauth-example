import { getParams } from "@/lib/route";
import GoogleService from "@/services/google";
import { Request } from "@/types";
import { ServerResponse } from "node:http";

async function GET(req: Request, res: ServerResponse) {
  const params = getParams(req);
  const code = params.get("code");
  const state = params.get("state");
  const stateFromSession = req.session.data.loginState;
  const appName = process.env.GOOGLE_APP_NAME;
  const clientId = process.env.GOOGLE_APP_CLIENT_ID;
  const redirectUrl = process.env.GOOGLE_APP_REDIRECT_URL;
  const clientSecret = process.env.GOOGLE_APP_CLIENT_SECRET;

  if (!code) return res.end("code param is missing");
  if (!state) return res.end("state param is missing");
  if (!appName) return res.end("GOOGLE_APP_NAME is not set");
  if (!clientId) return res.end("GOOGLE_APP_CLIENT_ID is not set");
  if (!redirectUrl) return res.end("GOOGLE_APP_REDIRECT_URL is not set");
  if (!clientSecret) return res.end("GOOGLE_APP_CLIENT_SECRET is not set");

  if (state !== stateFromSession) return res.end("Invalid state.");

  const response = await GoogleService.request({
    url: GoogleService.tokenUrl,
    method: "POST",
    appName,
    body: {
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUrl,
      code,
      grant_type: "authorization_code",
    },
  });

  const responseBody = await response.json();

  req.session.data.auth = {
    provider: "GOOGLE",
    body: {
      id_token: responseBody.id_token,
      access_token: responseBody.access_token,
      token_type: responseBody.token_type,
      scope: responseBody.scope,
    },
  };

  res.writeHead(302, { Location: "/dashboard" });
  res.end();
}

export default function (req: Request, res: ServerResponse) {
  if (req.method === "GET") return GET(req, res);
  res.end("Invalid route");
}
