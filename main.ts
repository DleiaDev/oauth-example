import { getPath } from "@/lib/route";
import { run as runSessionMiddleware } from "@/middleware/session";
import callbackRoute from "@/routes/callback";
import loginRoute from "@/routes/login";
import reposRoute from "@/routes/repos";
import http from "http";

const protectedRoutes = ["/repos"];
const unprotectedRoutes = ["/login"];

process.loadEnvFile();

http
  .createServer((rawReq, res) => {
    const req = runSessionMiddleware(rawReq, res);

    const path = getPath(req);
    const isLoggedIn = req.session.data.oauth !== undefined;

    if (!isLoggedIn && protectedRoutes.includes(path)) {
      res.end("Not logged in.");
      return;
    }

    if (isLoggedIn && unprotectedRoutes.includes(path)) {
      res.end("Already logged in.");
      return;
    }

    if (path === "/login") loginRoute(req, res);
    else if (path === "/callback") callbackRoute(req, res);
    else if (path === "/repos") reposRoute(req, res);
  })
  .listen(3000, () => console.log("Listening on http://localhost:3000"));
