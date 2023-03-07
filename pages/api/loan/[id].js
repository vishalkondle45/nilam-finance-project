import { getServerSession } from "next-auth";
import connectDB from "../../../middleware/mongodb";
import Loan from "../../../models/loan";
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
      var loan = await Loan.findOne({ id: req.query.id });
      return res.status(200).json({
        message: "Loans fetched successfully",
        title: "Success",
        color: "green",
        data: loan,
      });
    } catch (error) {
      return res.status(500).json({
        title: "Failed",
        color: "red",
        data: null,
        message: "Erorr while fetching loan",
      });
    }
  }

  // Update
  if (req.method === "PUT") {
    try {
      await Loan.findOneAndUpdate({ id: req.query.id }, req.body);
      return res.status(200).json({
        message: "Loan updated successfully.",
        title: "Success",
        data: null,
        color: "green",
      });
    } catch (error) {
      return res.status(500).json({
        title: "Failed",
        color: "red",
        data: null,
        message: "Erorr while updating loan",
      });
    }
  }

  if (req.method === "DELETE") {
    try {
      await Loan.findOneAndDelete({ id: req.query.id });
      return res.status(200).json({
        message: "Loan deleted successfully.",
        title: "Success",
        data: null,
        color: "green",
      });
    } catch (error) {
      return res.status(500).json({
        title: "Failed",
        color: "red",
        data: null,
        message: "Erorr while deleted loan",
      });
    }
  }
};

export default connectDB(handler);
