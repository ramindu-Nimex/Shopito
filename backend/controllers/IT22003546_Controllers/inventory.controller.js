import Inventory from "../../models/IT22003546_Models/intentory.model_01.js";

// Create new Inventory
export const createInventory = async (req, res) => {
    const newInventory = new Inventory(req.body);
    try {
        await newInventory.save();
        res.status(201).json(newInventory);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

// Get all Inventory
export const getInventory = async (req, res) => {
    try {
        const inventory = await Inventory.find();
        res.status(200).json(inventory);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

// Get single Inventory
export const getSingleInventory = async (req, res) => {
    try {
        const inventory = await Inventory.findById(req.params.id);
        res.status(200).json(inventory);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

// Update Inventory
export const updateInventory = async (req, res) => {
    try {
        const inventory = await Inventory.findByIdAndUpdate(req
            .params.id, req.body, { new: true });
        res.status(200).json(inventory);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

// Delete Inventory
export const deleteInventory = async (req, res, next) => {
    try {
        const { Inventoryid } = req.params;
        await Inventory.findByIdAndDelete(Inventoryid);
        return res.status(200).json({ message: "Inventory deleted successfully" });
    } catch (error) {
        next(error);
    }
}