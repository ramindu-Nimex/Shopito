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
      default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrhUG-tmEtXi0YhOg4K-qx-VQ5_Ei5Ujqdjg&s"
    },
    quantity: {
      type: Number,
      required: true,
    },
    condition: {
      type: Number,
      required: true
    },
    description: {
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
    slug: {
      type: String,
      required: true,
      unique: true
   },
  },
  { timestamps: true }
);

const ShoppingItemsMart = mongoose.model(
  "ShoppingItemsMart",
  ShoppingItemsSchema
);
export default ShoppingItemsMart;
