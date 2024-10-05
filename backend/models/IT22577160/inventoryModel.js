import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({
  productID: {
    type: String,
    required: true,
  },

  shopId: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: false,
  },

  productColor: {
    type: String,
    required: false,
  },

  productCategory: {
    type: String,
    required: false,
  },

  productDescription: {
    type: String,
  },

  price: {
    type: Number,
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
  },

  productStatus: {
    type: String,
    default: "Available",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  Discount_Applied: {
    type: String,
    default: "No",
    required: false,
  },
});

const InventoryAssist = mongoose.model("inventoryassistent", InventorySchema);
export default InventoryAssist;
