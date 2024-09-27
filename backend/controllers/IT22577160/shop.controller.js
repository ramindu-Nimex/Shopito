import ShopAssist from "../models/22577160/shopListingModel.js";

export const createShop = async (req, res, next) => {
  try {
    const newShop = new ShopAssist(req.body);
    const shop = await newShop.save();
    res.status(201).json(shop);
  } catch (error) {
    next(error);
  }
};