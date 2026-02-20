import mongoose from "mongoose";
import Listing from "../models/listing.js";
import data from "./data.js";

async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlustReact");

    console.log("connection successful");

    await initDB();
    mongoose.connection.close(); // optional but clean
  } catch (err) {
    console.error(err);
  }
}

const initDB = async () => {
  try {
    // 1️⃣ Delete existing data
    await Listing.deleteMany({});
    console.log("Old data deleted");

    // 2️⃣ Add new data
    const updatedData = data.data.map((obj) => ({
      ...obj,
      owner: "692c02f39f1acf0d76aabf12",
    }));

    await Listing.insertMany(updatedData);
    console.log("New data inserted");
  } catch (err) {
    console.error("Error initializing DB:", err);
  }
};

main();
