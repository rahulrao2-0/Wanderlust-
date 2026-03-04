import Review from "../models/review.js";

const createReview = async (req, res) => {  
     
     const { userId } = req.params;
     const { propertyId, rating, comment } = req.body;
     console.log("Creating review with:", {  userId, propertyId, rating, comment });  
        try {   
        const newReview = new Review({
            user: userId,
            listing: propertyId,
            rating,
            comment
        });
        await newReview.save();
        res.status(201).json({ message: "Review created successfully" });
    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({ message: "Failed to create review" });
    }
};

const getReviewsForListing = async (req, res) => {
    console.log("Fetching reviews for listing with params:", req.params);
    try {
        const { propertyId } = req.params;
        const reviews = await Review.find({ listing: propertyId }).populate("user") ;
        console.log("Fetched reviews for listing:", reviews);
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch reviews" });
    }
};

export { createReview, getReviewsForListing };