import crypto from "crypto";
import { Request } from "./types";
import { IncomingMessage, ServerResponse } from "node:http";

export type Session = {
  id: string;
  data: {
    auth?:
      | {
          provider: "GITHUB";
          body: {
            access_token: string;
            token_type: string;
            scope: string;
          };
        }
      | {
          provider: "GOOGLE";
          body: Record<string, string>;
        };
    loginState?: string;
    githubAccessToken?: string;
  };
};

const sessions: Record<Session["id"], Session> = {};

function generateSessionId() {
  return crypto.randomBytes(32).toString("hex");
}

function parseCookies(req: IncomingMessage) {
  const cookies: Record<string, string | undefined> = {};
  const header = req.headers.cookie;
  if (!header) return cookies;
  header.split(";").forEach((part) => {
    const [key, value] = part.split("=");
    cookies[key] = decodeURIComponent(value);
  });
  return cookies;
}

export function run(req: IncomingMessage, res: ServerResponse): Request {
  const cookies = parseCookies(req);

  let sessionId = cookies["sessionId"];
  if (sessionId) sessionId = sessionId.trim();

  let session = sessionId ? sessions[sessionId] : undefined;

  if (!session) {
    sessionId = generateSessionId();
    sessions[sessionId] = {
      id: sessionId,
      data: {},
    };
    session = sessions[sessionId];
  }

  res.setHeader("Set-Cookie", `sessionId=${sessionId}; HttpOnly; Path=/`);

  const modifiedReq = req as Request;
  modifiedReq.session = session;

  return modifiedReq;
}
