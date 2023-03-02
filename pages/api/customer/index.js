import { getServerSession } from "next-auth";
import connectDB from "../../middleware/mongodb";
import Customer from "../../models/customer";
import { authOptions } from "./auth/[...nextauth]";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  // Unauthorized User
  if (session) {
    return res.status(401).json({
      message: "You are not authorized to access this.",
      title: "Access Denied",
      data: null,
      color: "red",
    });
  }
  // New Customer
  if (req.method === "POST") {
    let customer = new Customer(req.body);
    await customer.save();
    return res.status(200).json({
      message: "Customer added successfully.",
      title: "Success",
      color: "green",
      data: null,
    });
  }
  // Read All Customers
  if (req.method === "GET") {
    let customers = await Customer.find({});
    return res.status(200).json({
      message: "Customers fetched successfully.",
      title: "Success",
      color: "green",
      data: customers,
    });
  }
};

export default connectDB(handler);
