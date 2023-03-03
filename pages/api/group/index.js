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
  if (req.method === "POST") {
    try {
      var groups = await Group.countDocuments();
      var group = new Group({ ...req.body, id: groups + 1 });
      await group.save();
      return res.status(200).json({
        message: "Group created successfully",
        title: "Success",
        color: "green",
        data: null,
      });
    } catch (error) {
      return res.status(500).json({
        title: "Failed",
        color: "red",
        data: error,
        message: "Erorr while creating group",
      });
    }
  }
  if (req.method === "GET") {
    try {
      var groups = await Group.find();
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
