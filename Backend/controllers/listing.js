import Listing from "../models/listing.js";
import Host from "../models/host.js";
export const allListings = async (req, res) => {
  try {
    const listings = await Listing.find();
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch listings" });
  }
};
export const HostAllListings = async(req,res)=>{
  // console.log(req.user)
  try{
    const host = await Host.findOne({user:req.user.id})
    const listings = await Listing.find({owner: host._id})
    res.status(200).json(listings)
    // console.log(listings)

  }catch(err){
    console.log(err)
  }
}
export const singleListing = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const listing = await Listing.findById(propertyId);
    // console.log(listing)

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.status(200).json(listing);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch property" });
  }
};
