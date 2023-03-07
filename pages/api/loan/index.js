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
  if (req.method === "POST") {
    try {
      var loans = await Loan.countDocuments();
      var loan = new Loan({ ...req.body, id: loans + 1 });
      await loan.save();
      return res.status(200).json({
        message: "Loan created successfully",
        title: "Success",
        color: "green",
        data: null,
      });
    } catch (error) {
      return res.status(500).json({
        title: "Failed",
        color: "red",
        data: error,
        message: "Erorr while creating loan",
      });
    }
  }
  if (req.method === "GET") {
    try {
      var loans = await Loan.find();
      return res.status(200).json({
        title: "Success",
        color: "green",
        data: loans,
        message: "Loans fetched successfully",
      });
    } catch (error) {
      return res.status(500).json({
        title: "Failed",
        color: "red",
        data: error,
        message: "Erorr while fetching loans",
      });
    }
  }
};

export default connectDB(handler);
