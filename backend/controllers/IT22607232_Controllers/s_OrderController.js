import ShoppingItemsMart from "../../models/IT22607232_Models/ShopItemModel.js";

export const createItem = async (req, res, next) => {
  if (!req.user.isShoppingOrderAdmin) {
    return next(
      errorHandler(403, "You are not authorized to create a listing")
    );
  }
  if (!req.body.title || !req.body.description) {
    return next(errorHandler(400, "Please Provide all the required fields"));
  }
  const slug = req.body.title.split(" ").join("-").toLowerCase().replace(/[^a-zA-Z0-9-]/g, "");

  const newListing = new ShoppingItemsMart({
    ...req.body,
    slug,
    userId: req.user.id
 });
  try {
    const savedListing = await newListing.save();
    res.status(201).json(savedListing);
  } catch (error) {
    next(error);
  }
};
