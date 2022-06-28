import { CookieJarCookies } from "../types";

interface NextApiRequestCookies {
  [key: string]: string;
}

export const parseCookies = (cookies: NextApiRequestCookies) => {
  return {
    _3sct: cookies._3sct,
    "N%40TCookie": cookies["N%40TCookie"],
    IsActiveOrIsRunningInMSTeams: cookies.IsActiveOrIsRunningInMSTeams,
  } as CookieJarCookies;
};
