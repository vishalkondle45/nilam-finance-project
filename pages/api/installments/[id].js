import { getServerSession } from "next-auth";
import connectDB from "../../../middleware/mongodb";
import Installment from "../../../models/installment";
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
      let installment = await Installment.find({ loan: req.query.id });
      return res.status(200).json({
        message: "Installments fetched successfully",
        title: "Success",
        color: "green",
        data: installment,
      });
    } catch (error) {
      return res.status(500).json({
        title: "Failed",
        color: "red",
        data: null,
        message: "Erorr while fetching installment",
      });
    }
  }
  if (req.method === "DELETE") {
    try {
      await Installment.findOneAndDelete({
        id: req.query.id,
      });
      return res.status(200).json({
        message: "Installment deleted successfully",
        title: "Success",
        color: "green",
        data: null,
      });
    } catch (error) {
      return res.status(500).json({
        title: "Failed",
        color: "red",
        data: null,
        message: "Erorr while deleting installment",
      });
    }
  }
};

export default connectDB(handler);
