import { Session } from "@/middleware/session";
import { IncomingMessage, ServerResponse } from "node:http";

export type Request = IncomingMessage & {
  session: Session;
};

export type RouteModule = {
  default: (req: Request, res: ServerResponse) => ServerResponse;
};
