import mongoose from "mongoose";
var Schema = mongoose.Schema;

var groupSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    comments: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

mongoose.models = {};

global.Group = global.Group || mongoose.model("Group", groupSchema);

export default global.Group;
