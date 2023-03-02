import mongoose from "mongoose";
var Schema = mongoose.Schema;

var customerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  since: {
    type: Date,
    default: Date.now,
  },
});

mongoose.models = {};

global.Customer = global.Customer || mongoose.model("Customer", customerSchema);

export default global.Customer;
