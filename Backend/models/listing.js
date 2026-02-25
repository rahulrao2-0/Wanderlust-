import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    // Optional: include if you want to store custom IDs
    id: {
      type: Number,
      unique: true,
      sparse: true // allows documents without this field
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    image: [
      {
        url: {
        type: String,
        required: true
      },
      public_id: {
        type: String,
        required: true
      }
      }

    ],

    price: {
      type: Number,
      required: true,
      min: 0
    },

    location: {
      type: String,
      required: true
    },

    country: {
      type: String,
      required: true
    },

    // 👤 HOST
    host: {
      name: {
        type: String,
        required: true
      },
      experience: {
        type: String // "8 years"
      },
      contact: {
        type: String
      }
    },

    // 🏨 HOTEL DETAILS
    hotelDetails: {
      type: {
        type: String, // Villa, Apartment, Room, Private Room, Luxury Apartment
        required: true
      },
      rooms: {
        type: Number,
        required: true
      },
      bathrooms: {
        type: Number,
        required: true
      },
      maxGuests: {
        type: Number,
        required: true
      }
    },

    // ⭐ AMENITIES
    amenities: {
      type: [String],
      default: []
    },

    // 📋 HOTEL RULES
    hotelRules: {
      checkIn: {
        type: String,
        required: true
      },
      checkOut: {
        type: String,
        required: true
      },
      petsAllowed: {
        type: Boolean,
        default: false
      },
      smokingAllowed: {
        type: Boolean,
        default: false
      }
    },
    owner:{
      type: mongoose.Schema.Types.ObjectId,
     ref: "Host",
    },
    geometry:{
      type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
    }
  },
  { timestamps: true }
);

const Listing = mongoose.models.Listing || mongoose.model("Listing", listingSchema);

export default Listing;