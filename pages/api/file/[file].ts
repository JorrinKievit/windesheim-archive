import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "../../../types";
import { parseCookies } from "../../../utils/CookieHelper";
import { WindesheimClient } from "../../../utils/windesheimClient";
import fs from "fs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any | ApiError>
) {
  const { file } = req.query;
  const cookies = parseCookies(req.cookies);
  const client = new WindesheimClient(cookies).client;

  try {
    const response = await client.get(file as string, {
      responseType: "arraybuffer",
    });
    if (response.status === 200) {
      res.status(200).json(response.data.toString("base64"));
    } else {
      res
        .status(500)
        .json({ message: "Something went wrong when retrieving a file" });
    }
  } catch (e) {
    res
      .status(500)
      .json({ message: "Something went wrong when retrieving a file" });
  }
}

export const config = {
  api: {
    responseLimit: false,
  },
};
