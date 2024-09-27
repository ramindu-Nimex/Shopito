import express from "express";
import {
  createShopListing,
  getShopListing,
  getAllShopListings,
  updateShopListing,
  deleteShopListing,
} from "../../controllers/IT22350114_Controllers/shopListingController_02.js";
import { verifyToken } from "../../utils/verifyToken.js";

const router = express.Router();

// Create a new shop listing
router.post("/create", verifyToken, createShopListing);

// Read all shop listings
router.get("/read", verifyToken, getAllShopListings);

// Fetch a specific shop listing
router.get("/read/:shopId", verifyToken, getShopListing);

// Update a shop listing
router.put("/update/:shopId", verifyToken, updateShopListing);

// Delete a shop listing
router.delete("/delete/:shopId", verifyToken, deleteShopListing);

export default router;
