import { getServerSession } from "next-auth";
import connectDB from "../../../middleware/mongodb";
import Customer from "../../../models/customer";
import { authOptions } from "../auth/[...nextauth]";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({
      message: "You are not authorized to access this.",
      title: "Access Denied",
      data: null,
      color: "red",
    });
  }
  // customer_id - req.query.id
  // Read
  if (req.method === "GET") {
    let customer = await Customer.findOne({ id: req.query.id });
    return res.status(200).json({
      message: "Customer fetched successfully.",
      title: "Success",
      data: customer,
      color: "green",
    });
  }
  // Update
  if (req.method === "PUT") {
    await Customer.findOneAndUpdate({ id: req.query.id }, req.body);
    return res.status(200).json({
      message: "Customer updated successfully.",
      title: "Success",
      data: null,
      color: "green",
    });
  }
  // Delete
  if (req.method === "DELETE") {
    await Customer.findOneAndDelete({ id: req.query.id });
    return res.status(200).json({
      message: "Customer deleted successfully.",
      title: "Success",
      data: null,
      color: "green",
    });
  }
};

export default connectDB(handler);
