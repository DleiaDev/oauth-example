import { ServerResponse } from "node:http";
import { Request } from "../middleware/types";
import GitHubService from "../services/github";

async function GET(req: Request, res: ServerResponse) {
  const appName = process.env.GITHUB_APP_NAME;
  const accessToken = req.session.data.githubAccessToken;

  if (!appName) return res.end("GITHUB_APP_NAME is not set");
  if (!accessToken) return res.end("Not logged in");

  const gh = new GitHubService(appName, accessToken);

  const response = await gh.request({
    method: "GET",
    path: "/user/repos",
    accessToken,
    params: {
      sort: "created",
      direction: "desc",
    },
  });

  res.writeHead(200, { "Content-Type": "application/json" });
  return res.end(JSON.stringify(response));
}

export default function reposRoute(req: Request, res: ServerResponse) {
  if (req.method === "GET") return GET(req, res);

  res.end("Invalid route");
}
