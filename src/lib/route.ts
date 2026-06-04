import { Request } from "../middleware/types";

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
