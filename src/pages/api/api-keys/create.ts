import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { CreateApiData } from "@/types/api";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { nanoid } from "nanoid";
import { z } from "zod";
import { withMethods } from "@/lib/api-middleware/with-methods";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<CreateApiData>
) => {
  try {
    const user = await getServerSession(req, res, authOptions).then(
      (res) => res?.user
    );
    if (!user) {
      return res.status(401).json({
        error: "Unauthorized",
        createdApiKey: null,
      });
    }
    const existingApiKey = await db.apiKey.findFirst({
      where: {
        userId: user.id,
        enabled: true,
      },
    });
    if (existingApiKey) {
      return res.status(400).json({
        error: "An API key already exists",
        createdApiKey: null,
      });
    }
    const createdApiKey = await db.apiKey.create({
      data: {
        userId: user.id,
        key: nanoid(),
      },
    });
    return res.status(200).json({
      error: null,
      createdApiKey,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: error.issues,
        createdApiKey: null,
      });
    }
    return res.status(500).json({
      error: "Internal server error",
      createdApiKey: null,
    });
  }
};
export default withMethods(["GET"], handler);
