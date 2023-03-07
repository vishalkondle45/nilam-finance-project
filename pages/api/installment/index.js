import { getServerSession } from "next-auth";
import connectDB from "../../../middleware/mongodb";
import Installment from "../../../models/installment";
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
      var installments = await Installment.countDocuments();
      var installment = new Installment({ ...req.body, id: installments + 1 });
      await installment.save();
      let count = await Loan.findOne({ id: req.body.loan }).select("count");
      if (count === installments) {
        await Loan.findOneAndUpdate({ id: req.body.loan }, { nextDue: null });
      } else {
        await Loan.findOneAndUpdate(
          { id: req.body.loan },
          { nextDue: req.body.nextDue }
        );
      }
      return res.status(200).json({
        message: "Installment created successfully",
        title: "Success",
        color: "green",
        data: null,
      });
    } catch (error) {
      return res.status(500).json({
        title: "Failed",
        color: "red",
        data: error,
        message: "Erorr while creating installment",
      });
    }
  }
  if (req.method === "GET") {
    try {
      var installments = await Installment.find();
      return res.status(200).json({
        title: "Success",
        color: "green",
        data: installments,
        message: "Installments fetched successfully",
      });
    } catch (error) {
      return res.status(500).json({
        title: "Failed",
        color: "red",
        data: error,
        message: "Erorr while fetching installments",
      });
    }
  }
};

export default connectDB(handler);
