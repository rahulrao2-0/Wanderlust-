import mongoose from "mongoose";
import User from "./user.js";
import Listing from "./listing.js";

const hostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One user = one host profile
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    contactNo: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
hostSchema.pre("findOneAndDelete", async function (next) {
  const host = await this.model.findOne(this.getFilter());

  if (host) {
    await Listing.deleteMany({ owner: host._id });
  }

});

const Host = mongoose.model("Host", hostSchema);
export default Host;
