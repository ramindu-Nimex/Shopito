import ShopListing from "../../models/IT22350114_Models/shopListingModel_02.js";


// Create a new shop listing
export const createShopListing = async (req, res, next) => {
  try {
    // Create a new shop listing using the data from the request body
    const newShopListing = await ShopListing.create(req.body);

    // Send a success response with the newly created shop listing
    return res.status(201).json({
      success: true,
      message: "Shop listing created successfully",
      shopListing: newShopListing,
    });
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
};

// Read all shop listings
export const getAllShopListings = async (req, res, next) => {
  try {
    const allShopListings = await ShopListing.find();
    if (!allShopListings) {
      return res.status(404).json({ message: "Shop listings not found" });
    }
    return res.status(200).json(allShopListings);
  } catch (error) {
    next(error);
  }
};

// Fetch a specific shop listing by shopID
export const getShopListing = async (req, res, next) => {
  try {
    const { shopId } = req.params;  // Retrieve shopID from params
    const shopListing = await ShopListing.findOne({ shopID: shopId });  // Use findOne with shopID
    
    if (!shopListing) {
      return res.status(404).json({ message: "Shop listing not found" });
    }
    return res.status(200).json(shopListing);
  } catch (error) {
    next(error);  // This will pass any errors to your error handler middleware
  }
};


// Update a shop listing using shopID
export const updateShopListing = async (req, res, next) => {
  try {
    const { shopId } = req.params;  // Retrieve shopID from params
    const updateShopListing = await ShopListing.findOneAndUpdate(
      { shopID: shopId },  // Find by shopID, not _id
      req.body,
      { new: true, upsert: true }  // Return the updated document and upsert if not found
    );
    if (!updateShopListing) {
      return res.status(404).json({ message: "Shop listing not found" });
    }
    return res.status(200).json(updateShopListing);
  } catch (error) {
    next(error);
  }
};
// Delete a shop listing
export const deleteShopListing = async (req, res, next) => {
  try {
    const { shopId } = req.params;
    await ShopListing.findByIdAndDelete(shopId);
    return res.status(200).json({
      success: true,
      message: "Shop listing deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};