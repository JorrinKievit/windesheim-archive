import { NextApiRequest, NextApiResponse } from "next";
import { StudyRouteContent, ApiError } from "../../../types";
import { WINDESHEIM_LOAD_STUDY_ROUTE_CONTENT } from "../../../utils/constants";
import { parseCookies } from "../../../utils/CookieHelper";
import { WindesheimClient } from "../../../utils/windesheimClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StudyRouteContent[] | ApiError>
) {
  const { slug } = req.query;
  const route_id = slug[0];
  const folder_id = slug[1];
  const cookies = parseCookies(req.cookies);
  const client = new WindesheimClient(cookies).client;

  try {
    const response = await client.get(
      WINDESHEIM_LOAD_STUDY_ROUTE_CONTENT(route_id, folder_id)
    );
    if (response.status === 200) {
      res.status(200).json(response.data.STUDYROUTE_CONTENT);
    } else {
      res.status(500).json({
        message: "Something went wrong when retrieving study route content",
      });
    }
  } catch (e) {
    res.status(500).json({
      message: "Something went wrong when retrieving study route content",
    });
  }
}
