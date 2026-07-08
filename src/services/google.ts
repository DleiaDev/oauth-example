type Method = "POST" | "GET";

type RequestArgStatic = {
  url: string;
  method: Method;
  appName: string;
  idToken?: string;
  accessToken?: string;
  path?: string;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  body?: Record<string, string>;
};

export default class GoogleService {
  static tokenUrl = "https://oauth2.googleapis.com/token";
  static authorizationUrl = "https://accounts.google.com/o/oauth2/v2/auth";

  static async request(arg: RequestArgStatic) {
    const headers = arg.headers ?? {};
    const params = arg.params ?? {};
    const body = arg.body ?? {};
    const urlObj = new URL(arg.url);

    // Set headers
    const headersFinal: Record<string, string> = {
      ...headers,
      // Accept: "application/vnd.github+json",
      // "X-GitHub-Api-Version": GitHubService.version,
      // "User-Agent": arg.appName,
    };

    // Set token
    if (arg.accessToken)
      headersFinal.Authorization = `Bearer ${arg.accessToken}`;

    // Set path
    if (arg.path) urlObj.pathname = arg.path;

    // Set params
    Object.keys(params).forEach((key) => {
      urlObj.searchParams.append(key, params[key]);
    });

    // Execute
    return fetch(urlObj.toString(), {
      headers: headersFinal,
      method: arg.method,
      body: arg.method != "GET" ? JSON.stringify(body) : undefined,
    });
  }
}
