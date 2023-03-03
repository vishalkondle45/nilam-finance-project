import { getServerSession } from "next-auth";
import connectDB from "../../../middleware/mongodb";
import Customer from "../../../models/customer";
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
      var customers = await Customer.find().select("id name");
      let output = customers.map(
        (customer) => customer.id + " - " + customer.name
      );
      return res.status(200).json({
        error: false,
        ok: true,
        data: output,
        message: "Customers fetched successfully",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        ok: false,
        data: error,
        message: "Erorr while fetching loans",
      });
    }
  }
};

export default connectDB(handler);
