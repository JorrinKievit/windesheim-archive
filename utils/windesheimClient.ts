import axios, { AxiosInstance } from "axios";
import { HttpCookieAgent, HttpsCookieAgent } from "http-cookie-agent/http";
import { CookieJar } from "tough-cookie";
import { CookieJarCookies } from "../types";
import { WINDESHEIM_URL } from "./constants";

export class WindesheimClient {
  client: AxiosInstance;

  constructor(cookies: CookieJarCookies) {
    const jar = new CookieJar();
    jar.setCookieSync(
      `IsActiveOrIsRunningInMSTeams=${cookies.IsActiveOrIsRunningInMSTeams}`,
      WINDESHEIM_URL
    );
    jar.setCookieSync(`_3sct=${cookies._3sct}`, WINDESHEIM_URL);
    jar.setCookieSync(`N%40TCookie=${cookies["N%40TCookie"]}`, WINDESHEIM_URL);

    const windesheimClient = axios.create({
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      httpAgent: new HttpCookieAgent({
        cookies: { jar },
        keepAlive: true,
        keepAliveMsecs: 60 * 60 * 1000,
      }),
      httpsAgent: new HttpsCookieAgent({
        cookies: { jar },
        keepAlive: true,
        keepAliveMsecs: 60 * 60 * 1000,
      }),
    });
    this.client = windesheimClient;
  }
}
