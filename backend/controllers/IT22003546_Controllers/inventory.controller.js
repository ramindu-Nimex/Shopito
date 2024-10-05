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

export const getInventoryByShopID = async (req, res) => {
    const { shopid } = req.params; // Get shopID from query parameters
    //console.log("Received shopID:", shopid);
    try {
        const inventory = await Inventory.find({ shopID: shopid }); // Filter by shopID
        res.status(200).json(inventory);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Get all Inventory
export const getInventory = async (req, res) => {
    try {
        const inventory = await Inventory.find();
        res.status(200).json(inventory);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

//Get inventory Listing by ID
export const getSingleInventory = async (req, res) => {
    const { Inventoryid } = req.params; // Change to match the desired parameter name
    //console.log("Received inventoryID:", Inventoryid); // Log the inventory ID

    try {
        const inventoryListing = await Inventory.findById(Inventoryid); // Fetch by inventory ID

        if (inventoryListing.length === 0) { // Check if no inventory found
            return res.status(404).json({ message: "Inventory Listing not found" });
        }
        
        // Return the found inventory item
        res.status(200).json(inventoryListing);
    } catch (error) {
        // Return error message in case of an exception
        res.status(500).json({ message: error.message });
    }
}



// Update Inventory
export const updateInventory = async (req, res, next) => {
    try {
        const { Inventoryid } = req.params;
        const inventory = await Inventory.findByIdAndUpdate(Inventoryid, req.body, { new: true, upsert: true });
        return res.status(200).json(inventory);
    }
    catch (error) {
        next(error);
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