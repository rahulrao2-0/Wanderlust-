const sampleData = [
  {
    title: "rahul",
    description: "Sample listing 1",
    image: {
      url: "https://images.unsplash.com/photo-1505691723518-36a5ac3be353",
      filename: "sample1"
    },
    price: 120,
    location: "Mahendragarh, Haryana",
    country: "India",
    rating: 4,

    host: {
      name: "Rahul Yadav",
      experience: "2 years",
      contact: "rahul@gmail.com"
    },

    hotelDetails: {
      type: "Apartment",
      rooms: 2,
      bathrooms: 1,
      maxGuests: 3
    },

    amenities: [
      "Free WiFi",
      "Air Conditioning",
      "Parking",
      "Kitchen"
    ],

    hotelRules: {
      checkIn: "12:00 PM",
      checkOut: "10:00 AM",
      petsAllowed: false,
      smokingAllowed: false
    }
  },

  {

    title: "neo apartment",
    description: "Modern apartment with city view",
    image: {
      url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
      filename: "sample2"
    },
    price: 200,
    location: "Gurgaon, Haryana",
    country: "India",
    rating: 5,

    host: {
      name: "Neeraj Sharma",
      experience: "5 years",
      contact: "neeraj@gmail.com"
    },

    hotelDetails: {
      type: "Apartment",
      rooms: 3,
      bathrooms: 2,
      maxGuests: 5
    },

    amenities: [
      "WiFi",
      "Lift",
      "Gym",
      "Power Backup"
    ],

    hotelRules: {
      checkIn: "1:00 PM",
      checkOut: "11:00 AM",
      petsAllowed: true,
      smokingAllowed: false
    }
  },

  {

    title: "cozy villa",
    description: "Peaceful villa with private garden",
    image: {
      url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
      filename: "sample3"
    },
    price: 350,
    location: "Jaipur, Rajasthan",
    country: "India",
    rating: 5,

    host: {
      name: "Amit Singh",
      experience: "8 years",
      contact: "amit@gmail.com"
    },

    hotelDetails: {
      type: "Villa",
      rooms: 4,
      bathrooms: 3,
      maxGuests: 8
    },

    amenities: [
      "Private Garden",
      "Swimming Pool",
      "WiFi",
      "Parking"
    ],

    hotelRules: {
      checkIn: "2:00 PM",
      checkOut: "11:00 AM",
      petsAllowed: true,
      smokingAllowed: true
    }
  },

  {

    title: "budget room",
    description: "Affordable room near city center",
    image: {
      url: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c",
      filename: "sample4"
    },
    price: 80,
    location: "Bhopal, Madhya Pradesh",
    country: "India",
    rating: 3,

    host: {
      name: "Rakesh Verma",
      experience: "1 year",
      contact: "rakesh@gmail.com"
    },

    hotelDetails: {
      type: "Private Room",
      rooms: 1,
      bathrooms: 1,
      maxGuests: 2
    },

    amenities: [
      "WiFi",
      "Fan",
      "Nearby Transport"
    ],

    hotelRules: {
      checkIn: "11:00 AM",
      checkOut: "9:00 AM",
      petsAllowed: false,
      smokingAllowed: false
    }
  },

  {

    title: "luxury stay",
    description: "Premium stay with all amenities",
    image: {
      url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
      filename: "sample5"
    },
    price: 500,
    location: "Mumbai, Maharashtra",
    country: "India",
    rating: 5,

    host: {
      name: "Sanjay Mehta",
      experience: "10 years",
      contact: "sanjay@gmail.com"
    },

    hotelDetails: {
      type: "Luxury Apartment",
      rooms: 5,
      bathrooms: 4,
      maxGuests: 10
    },

    amenities: [
      "Swimming Pool",
      "Gym",
      "WiFi",
      "Room Service",
      "Sea View"
    ],

    hotelRules: {
      checkIn: "3:00 PM",
      checkOut: "12:00 PM",
      petsAllowed: false,
      smokingAllowed: false
    }
  }
];


export default {data:sampleData}