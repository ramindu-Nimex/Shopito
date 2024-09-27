// import InventoryAssist from "../models/inventoryModel.js";

// export const inventoryModel = async (req, res, next) => {
//     try {
//         const newInventoryItem = new InventoryAssist(req.body);
//         const inventoryItem = await newInventoryItem.save();
//         res.status(201).json(inventoryItem);
//     } catch (error) {
//         next(error);
//     }
// }