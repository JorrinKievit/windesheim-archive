import { NextApiRequest, NextApiResponse } from "next";
import { ApiError, StudyRouteUserhandInDetails } from "../../../types";
import { WINDESHEIM_LOAD_USER_HANDIN_DETAILS } from "../../../utils/constants";
import { parseCookies } from "../../../utils/CookieHelper";
import { WindesheimClient } from "../../../utils/windesheimClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StudyRouteUserhandInDetails[] | ApiError>
) {
  const { resourceId } = req.query;
  const cookies = parseCookies(req.cookies);
  const client = new WindesheimClient(cookies).client;

  try {
    const response = await client.get(
      WINDESHEIM_LOAD_USER_HANDIN_DETAILS(resourceId as string)
    );
    if (response.status === 200) {
      res.status(200).json(response.data.STUDYROUTE_USER_HANDINDETAILS);
    } else {
      res.status(500).json({
        message: "Something went wrong when retrieving handIn details",
      });
    }
  } catch (e) {
    res
      .status(500)
      .json({ message: "Something went wrong when retrieving handIn details" });
  }
}
