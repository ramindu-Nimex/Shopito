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
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");

  const newListing = new ShoppingItemsMart({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    const savedListing = await newListing.save();
    res.status(201).json(savedListing);
  } catch (error) {
    next(error);
  }
};

export const getOrderListing = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    const listings = await ShoppingItemsMart.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.quantity && { quantity: req.query.quantity }),
      ...(req.query.orderId && { _id: req.query.orderId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { description: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const totalResources = await ShoppingItemsMart.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthResources = await ShoppingItemsMart.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({ listings, totalResources, lastMonthResources });
  } catch (error) {
    next(error);
  }
};

export const deleteOrders = async (req, res, next) => {
  if (!req.user.isShoppingOrderAdmin || req.user.id !== req.params.userId) {
    return next(
      errorHandler(403, "You are not authorized to delete this resource")
    );
  }
  try {
    await ShoppingItemsMart.findByIdAndDelete(req.params.postId);
    res.status(200).json("The resource has been deleted successfully");
  } catch (error) {
    next(error);
  }
};
