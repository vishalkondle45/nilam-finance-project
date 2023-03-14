import { getServerSession } from "next-auth";
import connectDB from "../../../middleware/mongodb";
import Group from "../../../models/group";
import { authOptions } from "../auth/[...nextauth]";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res
      .status(401)
      .json({ error: true, message: "You are unauthorized!" });
  }
  if (req.method === "GET") {
    try {
      var result = await Group.find().select("name");
      let groups = result.map((group) => group.name);
      return res.status(200).json({
        title: "Success",
        color: "green",
        data: groups,
        message: "Groups fetched successfully",
      });
    } catch (error) {
      return res.status(500).json({
        title: "Failed",
        color: "red",
        data: error,
        message: "Erorr while fetching groups",
      });
    }
  }
};

export default connectDB(handler);
