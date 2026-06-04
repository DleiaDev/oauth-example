import { ServerResponse } from "node:http";
import { Request } from "../middleware/types";
import { getParams } from "../lib/route";
import GitHubService from "../services/github";

async function GET(req: Request, res: ServerResponse) {
  const params = getParams(req);
  const code = params.get("code");
  const state = params.get("state");
  const stateFromSession = req.session.data.loginState;
  const appName = process.env.GITHUB_APP_NAME;
  const clientId = process.env.GITHUB_APP_CLIENT_ID;
  const redirectUrl = process.env.GITHUB_APP_REDIRECT_URL;
  const clientSecret = process.env.GITHUB_APP_CLIENT_SECRET;

  if (!code) return res.end("code param is missing");
  if (!state) return res.end("state param is missing");
  if (!appName) return res.end("GITHUB_APP_NAME is not set");
  if (!clientId) return res.end("GITHUB_APP_CLIENT_ID is not set");
  if (!redirectUrl) return res.end("GITHUB_APP_REDIRECT_URL is not set");
  if (!clientSecret) return res.end("GITHUB_APP_CLIENT_SECRET is not set");

  if (state !== stateFromSession) return res.end("Invalid state.");

  const response = await GitHubService.getAccessToken(
    clientId,
    clientSecret,
    redirectUrl,
    code,
    appName,
  );

  req.session.data.githubAccessToken = response.access_token;
  res.end();
}

export default function callbackRoute(req: Request, res: ServerResponse) {
  if (req.method === "GET") return GET(req, res);
  res.end("Invalid route");
}
