import express from "express";
import mongoose from "mongoose";

const ShoppingItemsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },

    shop: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      default: "Uncategorized",
    },
    image: {
      type: String,
      default:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.flipkart.com%2Fthapnath-women-maxi-black-dress%2Fp%2Fitmdb3360ce76f6a%3Fpid%3DDREGTJCDQMBYJ3GW%26lid%3DLSTDREGTJCDQMBYJ3GWE7QZ4E%26marketplace%3DFLIPKART%26cmpid%3Dcontent_dress_8965229628_gmc&psig=AOvVaw0tiwAkZIVpuCF13lFG7Whc&ust=1725032497594000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCKDApIHFmogDFQAAAAAdAAAAABAJ",
    },
    quantity: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    offer: {
      type: Boolean,
      required: true,
    },
    regularPrice: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      required: true,
    },
    
  },
  { timestamps: true }
);

const ShoppingItemsMart = mongoose.model(
  "ShoppingItemsMart",
  ShoppingItemsSchema
);
export default ShoppingItemsMart;
