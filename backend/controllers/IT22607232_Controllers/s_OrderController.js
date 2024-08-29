import ShoppingItemsMart from "../../models/IT22607232_Models/ShopItemModel.js";
import { errorHandler } from "../../utils/error.js";


// export const createItem = async (req, res, next) => {
//     // if(!req.user.isShoppingOrderAdmin
//     // ) {
//     //    return next(errorHandler(403, "You are not authorized to add a item to the shopito mart"))
//     // }
//     if(!req.body.title || !req.body.description) {
//        return next(errorHandler(400, "Please Provide all the required fields"))
//     }
//     const slug = req.body.title.split(" ").join("-").toLowerCase().replace(/[^a-zA-Z0-9-]/g, "");
 
//     const newItem = new ShoppingItemsMart({
//        ...req.body,
//        slug,
//        userId: req.user.id
//     });
//     try {
//        const savedItem = await newItem.save();
//        res.status(201).json(savedItem);
//     } catch (error) {
//        next(error);
//     }
//  }

//Create a new shop item
export const createItem = async (req, res) => {
  const newItem = new ShoppingItemsMart(req.body);
  try {
      await newItem.save();
      res.status(201).json(newItem);
  } catch (error) {
      res.status(409).json({ message: error.message });
  }
}
