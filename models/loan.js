import mongoose from "mongoose";
var Schema = mongoose.Schema;

var loanSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    customer: {
      type: String,
      required: true,
    },
    loanAmount: {
      type: Number,
      default: 0,
    },
    installment: {
      type: Number,
      default: 0,
    },
    interest: {
      type: Number,
      default: 0,
    },
    charges: {
      type: Number,
      default: 0,
    },
    count: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: new Date(),
    },
    nextDue: {
      type: Date,
      default: new Date(),
    },
    comments: {
      type: String,
      default: "",
    },
    group: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

mongoose.models = {};

global.Loan = global.Loan || mongoose.model("Loan", loanSchema);

export default global.Loan;
