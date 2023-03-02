import connectDB from "../../middleware/mongodb";
import Customer from "../../models/customer";

const handler = async (req, res) => {
  if (req.method === "POST") {
    // Check if name, email or password is provided
    const {
      name = "Vishal Kondle",
      email = "vishal.kondle@gmail.com",
      password = "Vammavg@78",
    } = req.body;
    if (name && email && password) {
      try {
        // Hash password to store it in DB
        // var passwordhash = await bcrypt.sign(password);
        var customer = new Customer({
          name,
          email,
          password,
        });
        // Create new customer
        var customercreated = await customer.save();
        return res.status(200).send(customercreated);
      } catch (error) {
        return res.status(500).send(error.message);
      }
    } else {
      res.status(422).send("data_incomplete");
    }
  } else {
    res.status(422).send("req_method_not_supported");
  }
};

export default connectDB(handler);
