import mongoose from "mongoose";

const shopListingSchema = new mongoose.Schema(
  {
    shopID: {
      type: String,
      required: true
    },
    shopName: {
      type: String,
      required: true,
    },
    shopLocation: {
      type: String,
      required: true,
    },
    shopDescription: {
      type: String,
      required: true,
    },
    shopCategory: {
      type: String,
      required: true,
    },
    shopPhone: {
      type: String,
      required: false
    },
    shopEmail: {
      type: String,
      required: false
    },
    shopWbsite: {
      type: String,
      required: false
    },
    shopOpeningHours: {
      type: String,
      required: false
    },
    isOpen: {
      type: Boolean,
      default: true,
      required: false
    },
    imageUrls: {
      type: Array,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

const ShopListing = mongoose.model("ShopListing", shopListingSchema);
export default ShopListing;
