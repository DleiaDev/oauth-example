import { ServerResponse } from "node:http";
import { Request } from "../middleware/types";
import GitHubService from "../services/github";
import { abort } from "@/lib/route";

async function githubDashboard(
  req: Request,
  res: ServerResponse,
): Promise<ServerResponse> {
  const appName = process.env.GITHUB_APP_NAME;
  const auth = req.session.data.auth;

  if (auth?.provider !== "GITHUB") throw new Error("Not logged in via GitHub.");
  if (!appName) return abort(res, 500, "GITHUB_APP_NAME is not set");

  const gh = new GitHubService(appName, auth.body.access_token);

  const response = await gh.request({
    method: "GET",
    path: "/user/repos",
    accessToken: auth.body.access_token,
    params: {
      sort: "created",
      direction: "desc",
    },
  });

  res.writeHead(200, { "Content-Type": "application/json" });
  return res.end(JSON.stringify(response));
}

async function GET(req: Request, res: ServerResponse) {
  const auth = req.session.data.auth;

  if (!auth) return abort(res, 401, "Not logged in");

  if (auth.provider === "GITHUB") return await githubDashboard(req, res);

  return res.end();
}

export default function (req: Request, res: ServerResponse) {
  if (req.method === "GET") return GET(req, res);

  res.end("Invalid route");
}
