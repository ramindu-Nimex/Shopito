import mongoose from "mongoose";
import ShoppingItemsMart from "../../models/IT22607232_Models/ShopItemModel.js";

export const reserveShoppingItem = async (req, res, next) => {
  try {
    // Extract the item ID from the request parameters
    const { itemId } = req.params;

    // Find the shopping item by ID
    const item = await ShoppingItemsMart.findById(itemId);

    // Check if the item exists
    if (!item) {
      const error = new Error("Item not found");
      error.statusCode = 404;
      return next(error);  // Pass the error to the global error handler
    }

    // Calculate if the item is expired (1 day expiration from creation time)
    const ONE_DAY_MS = 7 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    const expirationTime = new Date(item.createdAt).getTime() + ONE_DAY_MS;

    if (now > expirationTime) {
      const error = new Error("Item has expired");
      error.statusCode = 400;
      return next(error);  // Pass the error to the global error handler
    }

    // Mark the item as reserved (assuming you have a 'reserved' field in your schema)
    item.reserved = true;

    // Save the updated item to the database
    const updatedItem = await item.save();

    // Respond with success message and the reserved item
    res.status(200).json({
      message: "Item reserved successfully",
      status: "Reserved",
      item: updatedItem,  // Return updated item details
    });
  } catch (error) {
    // Handle any unexpected errors and pass them to the global middleware
    next(error);
  }
};



// Controller for fetching reserved item details
export const getReservedItemDetails = async (req, res, next) => {
    try {
      const { itemId } = req.params;
  
      // Check if itemId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(itemId)) {
        return res.status(400).json({ message: "Invalid item ID format" });
      }
  
      // Find the shopping item by ID
      const item = await ShoppingItemsMart.findById(itemId);
  
      // Check if the item exists
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
  
      // Return the item details if found
      res.status(200).json({ 
        message: "Item fetched successfully",
        item 
      });
    } catch (error) {
      // Handle any unexpected errors and pass them to the global middleware
      next(error);
    }
  };







// Controller for fetching all reserved items
export const getAllReservedItems = async (req, res, next) => {
    try {
      const reservedItems = await ShoppingItemsMart.find({ reserved: true });
  
      const updatedItems = reservedItems.map((item) => {
        const now = new Date();

        //reservation starts when the item is updated
        const reservationTime = new Date(item.updatedAt); 

        // Calculate the difference in seconds
        const diffInSeconds = (now - reservationTime) / 1000; 
  
        // // If the reservation has been more than 60 seconds, set the status to expired
        // if (diffInSeconds > 60) {
        //   item.reserved = false; // Change the status to expired
        //   item.save(); // Save the changes to the database
        // }
  
        // return item;

        // Set the isExpired property based on the reservation time
      item.isExpired = diffInSeconds >259200; // true if expired

      return item;
      });
  
      res.status(200).json({
        message: "Reserved items fetched and updated successfully",
        items: updatedItems,
      });
    } catch (error) {
      next(error); // Pass error to global error handler
    }
  };
  
  