import { run as runSessionMiddleware } from "@/middleware/session";
import { handleRoute } from "@/lib/route";
import http from "http";

process.loadEnvFile();

http
  .createServer((rawReq, res) => {
    const req = runSessionMiddleware(rawReq, res);
    handleRoute(req, res);
  })
  .listen(3000, () => console.log("Listening on http://localhost:3000"));
