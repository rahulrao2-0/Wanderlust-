
import dotenv from "dotenv";
dotenv.config();


import express        from "express";
import cors           from "cors";
import cookieParser   from "cookie-parser";
import mongoose       from "mongoose";
import multer         from "multer";
import fs             from "fs";
import { v2 as cloudinary } from "cloudinary";

import authRoutes     from "./routes/auth.js";
import listingRoutes  from "./routes/listing.js";
import bookingRoutes  from "./routes/booking.js";
import hostRoutes     from "./routes/host.js";
import adminRoutes    from "./routes/admin.js";
import { authMiddleware } from "./middleware/authValidate.js";
import User           from "./models/user.js";
import Host           from "./models/host.js";
import Listing        from "./models/listing.js";

import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding.js";
import mbxTilesets from "@mapbox/mapbox-sdk/services/tilesets.js";
import mapboxSdk from "@mapbox/mapbox-sdk";
import ExpressError from "./ExpressError.js";
import OpenAI from "openai";
const mapboxClient = mapboxSdk({
  accessToken: process.env.MAP_TOKEN,
});

const geocodingClient = mbxGeocoding(mapboxClient);
cloudinary.config({
  cloud_name : process.env.CLOUD_NAME,
  api_key    : process.env.CLOUD_API_KEY,
  api_secret : process.env.CLOUD_API_SECRET,
});


const upload = multer({ dest: "uploads/" });

const app = express();

app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


mongoose
  .connect("mongodb://127.0.0.1:27017/wanderlustReact")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));


app.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).select(
    "_id name email role isVerified"
  );
  if (!user) return res.status(404).json({ message: "User not found" });

  const host = await Host.findOne({ user: req.user.id });
  res.json({ user, isHost: !!host, host: host || null });
});

app.get("/api/search", async (req, res,next) => {
  const {query} = req.query;
  console.log(query)

  const results = await Listing.find({
    $or: [
      { location: { $regex: query, $options: "i" } },
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ],
  });

  console.log("Search results:", results);
  if(results.length === 0){ 
    next(new ExpressError(404, "No listings found matching your search"));
  }
  res.json({ results });
})

app.post(
  "/api/addListing",
  authMiddleware,
  upload.array("images",4),           
  async (req, res) => {
     const response = await geocodingClient.forwardGeocode({
     query: `${req.body.location.trim()}, ${req.body.country.trim()}`,
     limit: 5,
     types: ['place', 'locality', 'address'],
    autocomplete: true,
  // Optional: add proximity for bias
  // proximity: [userLongitude, userLatitude]
    }).send();

     
     console.log("Geocoding response:", response.body.features[1].geometry);
    try {
      console.log("Body :", req.body);
      console.log("File :", req.files);

      
      if (!req.files || req.files.length === 0){
        return res.status(400).json({ error: "Image file is required" });
      }
      const uploadedImages = [];

      for (let file of req.files) {
      const cloudResult = await cloudinary.uploader.upload(file.path, {
        folder: "listings",
        transformation: [{ width: 800, height: 600, crop: "limit", quality: "auto" }],
      });

      console.log("Cloudinary upload result:", cloudResult);

      uploadedImages.push({
        url: cloudResult.secure_url,
        public_id: cloudResult.public_id
      });
      }


      
      const { title, description, price, location, country,
              host, hotelDetails, amenities, hotelRules } = req.body;

      if (!title || !description || !price || !location || !country ||
          !host  || !hotelDetails || !hotelRules) {
        
        req.files.forEach(file => fs.unlink(file.path, () => {}));
        return res.status(400).json({ error: "Please fill in all required fields" });
      }

      
      if (req.files.length > 4) {
        req.files.forEach(file => fs.unlink(file.path, () => {}));
        return res.status(400).json({ error: "Maximum 4 images allowed" });
      }

      
      req.files.forEach(file => fs.unlink(file.path, () => {}));

     
      let parsedHost, parsedHotelDetails, parsedAmenities, parsedHotelRules;
      try {
        parsedHost         = JSON.parse(host);
        parsedHotelDetails = JSON.parse(hotelDetails);
        parsedAmenities    = JSON.parse(amenities || "[]");
        parsedHotelRules   = JSON.parse(hotelRules);
      } catch {
        return res.status(400).json({ error: "Invalid data format in request" });
      }

      const hostDoc = await Host.findOne({ user: req.user.id });
      if (!hostDoc) {
        return res.status(403).json({ error: "You must be a registered host to add listings" });
      }

    
      const listing = new Listing({
        title      : title.trim(),
        description: description.trim(),
        image: uploadedImages,
        price  : parseFloat(price),
        location: location.trim(),
        country : country.trim(),
        rating  : parseFloat(req.body.rating) || 4,
        host: {
          name      : parsedHost.name?.trim(),
          experience: parsedHost.experience?.trim() || "",
          contact   : parsedHost.contact?.trim()    || "",
        },
        hotelDetails: {
          type     : parsedHotelDetails.type,
          rooms    : parseInt(parsedHotelDetails.rooms),
          bathrooms: parseInt(parsedHotelDetails.bathrooms),
          maxGuests: parseInt(parsedHotelDetails.maxGuests),
        },
        amenities: parsedAmenities,
        hotelRules: {
          checkIn       : parsedHotelRules.checkIn?.trim(),
          checkOut      : parsedHotelRules.checkOut?.trim(),
          petsAllowed   : Boolean(parsedHotelRules.petsAllowed),
          smokingAllowed: Boolean(parsedHotelRules.smokingAllowed),
        },
        owner: hostDoc._id,
        geometry :response.body.features[1].geometry
      });

      const saved = await listing.save();
      console.log("Listing saved:", saved);

      return res.status(201).json({
        success: "Listing created successfully",
        listing: saved,
      });

    } catch (err) {
      console.error("addListing error:", err);

      // Clean up temp file on any error
      if (req.file?.path) fs.unlink(req.file.path, () => {});

      // If Cloudinary upload succeeded but DB failed, delete the orphan image
      if (err.cloudinaryPublicId) {
        cloudinary.uploader.destroy(err.cloudinaryPublicId).catch(console.error);
      }

      return res.status(500).json({ error: "Internal server error" });
    }
  }
);


app.delete("/api/deleteAccount", authMiddleware, async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.user.id);
    console.log("Account deletion result:", result);
    res.clearCookie("token");
    res.status(200).json({ success: true, result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete account" });
  }
});

///OpenAI API
app.post("/api/generateDescription", async (req, res) => {
  // const { title, location } = req.body;
  const input = `${req.body.title} ${req.body.location}`;
  console.log("Generating description for:", input);  
  const client = new OpenAI({
    api_key: process.env.OPENAI_API_KEY
  });
  const response = await client.responses.create({
    model:'gpt-4o-mini',
    input:`write luxury and modern description for a listing whose ${input} in less than 20 words`
  })

  const result= response.output[0].content[0].text.trim();
  console.log("Generated description:", result);
  res.json({ description: result });

});


app.use("/api/auth", authRoutes);
app.use("/api",      listingRoutes);
app.use("/api",      bookingRoutes);
app.use("/api",      hostRoutes);
app.use("/api/admin", adminRoutes);


app.use((err, req, res, next) => {
  console.error("Global error:", err);
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || "Internal server error",
  });
});


app.listen(5000, () => console.log("Server running on http://localhost:5000"));