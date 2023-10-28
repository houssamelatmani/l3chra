import User from "../../models/user";
import connectToMongoDb from "../../lib/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message: string;
  data: object;
};

export default async function Login(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const { username, password } = req.body;
    await connectToMongoDb();
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(400)
        .json({ message: "are you registred !!!!", data: {} });
    }
    if (user.password !== password) {
      return res.status(201).json({ message: "password incorrect", data: {} });
    }
    return res
      .status(200)
      .json({
        message: `welcome ${username}`,
        data: { username: user.username, id: user._id }
      });
  } catch (err) {
    console.error(err);
  }

}



