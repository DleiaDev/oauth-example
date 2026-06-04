import { Session } from "./session";
import { IncomingMessage } from "node:http";

export type Request = IncomingMessage & {
  session: Session;
};
