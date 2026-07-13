const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const urlschema = new mongoose.Schema(
  {
    shortid: {
      type: String,
      required: true,
      unique: true,
    },
    redirectURL: {
      type: String,
      required: true,
    },
    visitHistory: [{ timestamp: { type: Number } }],
    createdBy:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"users",
    }
    
  },
  { timestamps: true },
);

const url = mongoose.model("url", urlschema);

module.exports = url;
