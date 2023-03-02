import mongoose from "mongoose";
var Schema = mongoose.Schema;

var customerSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
    minlength: 10,
    maxlength: 10,
  },
  aadhar: {
    type: Number,
    required: true,
    minlength: 10,
    maxlength: 10,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  surity: {
    type: String,
    required: true,
  },
  comments: {
    type: String,
    required: false,
  },
});

mongoose.models = {};

global.Customer = global.Customer || mongoose.model("Customer", customerSchema);

export default global.Customer;
