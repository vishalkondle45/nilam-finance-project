import mongoose from "mongoose";
var Schema = mongoose.Schema;

var installmentSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    customer: {
      type: String,
      required: true,
    },
    loan: {
      type: Number,
      required: true,
    },
    installment: {
      type: Number,
      default: 0,
    },
    interest: {
      type: Number,
      default: 0,
    },
    fine: {
      type: Number,
      default: 0,
    },
    dueDate: {
      type: String,
      required: true,
    },
    paidDate: {
      type: String,
      required: true,
    },
    comments: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

mongoose.models = {};

global.Installment =
  global.Installment || mongoose.model("Installment", installmentSchema);

export default global.Installment;
