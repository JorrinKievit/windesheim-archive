import { NextApiRequest, NextApiResponse } from "next";
import { StudyRouteContent, ApiError } from "../../types";
import { WINDESHEIM_STUDY_ROUTES } from "../../utils/constants";
import { parseCookies } from "../../utils/CookieHelper";
import { WindesheimClient } from "../../utils/windesheimClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StudyRouteContent[] | ApiError>
) {
  const cookies = parseCookies(req.cookies);
  const client = new WindesheimClient(cookies).client;

  try {
    const response = await client.get(WINDESHEIM_STUDY_ROUTES);
    if (response.status === 200) {
      res.status(200).json(response.data.STUDYROUTES);
    } else {
      res
        .status(500)
        .json({ message: "Something went wrong when retrieving study routes" });
    }
  } catch (e) {
    res
      .status(500)
      .json({ message: "Something went wrong when retrieving study routes" });
  }
}
