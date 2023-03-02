import { getServerSession } from "next-auth";
import connectDB from "../../../middleware/mongodb";
import Customer from "../../../models/customer";
import { authOptions } from "../auth/[...nextauth]";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (session) {
    return res.status(401).json({
      message: "You are not authorized to access this.",
      title: "Access Denied",
      data: null,
      color: "red",
    });
  }
  // customer_id - req.body.id
  // Create
  if (req.method === "POST") {
    let customer = new Customer(req.body);
    await customer.save();
    return res.status(200).json({
      message: "You are not authorized to access this.",
      title: "Access Denied",
      data: null,
      color: "green",
    });
  }
  // Read
  if (req.method === "GET") {
  }
  // Update
  if (req.method === "PUT") {
  }
  // Delete
  if (req.method === "DELETE") {
  }
};

export default connectDB(handler);