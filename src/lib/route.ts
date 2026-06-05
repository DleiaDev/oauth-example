import { ServerResponse } from "http";
import { Request, RouteModule } from "@/types";
import routes from "@/routes";

function constructUrl(req: Request) {
  if (!req.url) throw new Error("Path missing");
  if (!req.headers.host) throw new Error("Host missing");

  const baseURL = "http://" + req.headers.host;
  const parsedUrl = new URL(req.url, baseURL);

  return parsedUrl;
}

export function getParams(req: Request) {
  const parsedUrl = constructUrl(req);
  return parsedUrl.searchParams;
}

export function getPath(req: Request) {
  const parsedUrl = constructUrl(req);
  return parsedUrl.pathname;
}

export async function handleRoute(req: Request, res: ServerResponse) {
  const path = getPath(req);
  const isLoggedIn = req.session.data.auth !== undefined;

  const route = routes.find((route) => route.path === path);

  if (!route) {
    res.writeHead(404);
    return res.end();
  }

  if (route.protected && !isLoggedIn) {
    return abort(res, 401, "Not logged in");
  }

  const module = (await import(`../web/${route.path}`)) as RouteModule;

  return module.default(req, res);
}

export function abort(
  res: ServerResponse,
  statusCode: number,
  message: string,
) {
  res.writeHead(statusCode);
  return res.end(message);
}
