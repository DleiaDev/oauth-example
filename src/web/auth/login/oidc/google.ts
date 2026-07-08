import crypto from "crypto";
import { ServerResponse } from "node:http";
import { Request } from "@/types";
import GoogleService from "@/services/google";

function GET(req: Request, res: ServerResponse) {
  const clientId = process.env.GOOGLE_APP_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_APP_CLIENT_SECRET;
  const redirectUrl = process.env.GOOGLE_APP_REDIRECT_URL;

  if (!clientId || !clientSecret || !redirectUrl)
    throw new Error(
      "GOOGLE_APP_CLIENT_ID or GOOGLE_APP_CLIENT_SECRET or GOOGLE_APP_REDIRECT_URL are not set",
    );

  const state = crypto.randomBytes(16).toString("hex");

  const session = req.session;
  session.data.loginState = state;

  const params = {
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUrl,
    scope: "openid email",
    state: state,
  };

  const authUrl = new URL(GoogleService.authorizationUrl);
  authUrl.search = new URLSearchParams(params).toString();

  res.writeHead(302, { Location: authUrl.toString() });
  res.end();
}

export default function (req: Request, res: ServerResponse) {
  if (req.method === "GET") return GET(req, res);
  res.end("Invalid route");
}
