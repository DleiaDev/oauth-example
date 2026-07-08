type Method = "POST" | "GET";

type RequestArgStatic = {
  url: string;
  method: Method;
  appName: string;
  accessToken?: string;
  path?: string;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  body?: Record<string, string>;
};

type RequestArg = {
  method: Method;
  path: string;
  accessToken?: string;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  body?: Record<string, string>;
};

type AccessTokenResponse = {
  access_token: string;
  token_type: string;
  scope: string;
};

export default class GitHubService {
  static version = "2026-03-10";
  static scope = "user public_repo";
  static apiBaseUrl = "https://api.github.com";
  static tokenUrl = "https://github.com/login/oauth/access_token";
  static authorizationUrl = "https://github.com/login/oauth/authorize";

  appName: string;
  accessToken: string;

  constructor(appName: string, accessToken: string) {
    this.appName = appName;
    this.accessToken = accessToken;
  }

  async request(arg: RequestArg) {
    const response = await GitHubService.request({
      ...arg,
      appName: this.appName,
      url: GitHubService.apiBaseUrl,
      accessToken: this.accessToken,
    });

    return response.json();
  }

  static async getAccessToken(
    clientId: string,
    clientSecret: string,
    redirectUrl: string,
    code: string,
    appName: string,
  ) {
    const params = {
      code,
      grant_type: "authorization_code",
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUrl,
    };

    const res = await GitHubService.request({
      params,
      appName,
      method: "GET",
      url: GitHubService.tokenUrl,
    });

    if (res.status !== 200) throw new Error("Request failed.");

    return res.json() as Promise<AccessTokenResponse>;
  }

  static async request(arg: RequestArgStatic) {
    const headers = arg.headers ?? {};
    const params = arg.params ?? {};
    const body = arg.body ?? {};
    const urlObj = new URL(arg.url);

    // Set headers
    const headersFinal: Record<string, string> = {
      ...headers,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": GitHubService.version,
      "User-Agent": arg.appName,
    };

    // Set access token
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
