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
      var group = await Group.findOne({ id: req.query.id });
      return res.status(200).json({
        message: "Groups fetched successfully",
        title: "Success",
        color: "green",
        data: group,
      });
    } catch (error) {
      return res.status(500).json({
        title: "Failed",
        color: "red",
        data: null,
        message: "Erorr while fetching group",
      });
    }
  }

  // Update
  if (req.method === "PUT") {
    try {
      await Group.findOneAndUpdate({ id: req.query.id }, req.body);
      return res.status(200).json({
        message: "Group updated successfully.",
        title: "Success",
        data: null,
        color: "green",
      });
    } catch (error) {
      return res.status(500).json({
        title: "Failed",
        color: "red",
        data: null,
        message: "Erorr while updating group",
      });
    }
  }

  if (req.method === "DELETE") {
    try {
      await Group.findOneAndDelete({ id: req.query.id });
      return res.status(200).json({
        message: "Group deleted successfully.",
        title: "Success",
        data: null,
        color: "green",
      });
    } catch (error) {
      return res.status(500).json({
        title: "Failed",
        color: "red",
        data: null,
        message: "Erorr while deleted group",
      });
    }
  }
};

export default connectDB(handler);
