import express from 'express';
import { createInventory, getInventoryByShopID, getInventory, getSingleInventory, updateInventory, deleteInventory } from '../../controllers/IT22003546_Controllers/inventory.controller.js';
import { verifyToken } from '../../utils/verifyToken.js';

const router = express.Router();

//error handling
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Create new Inventory
router.post('/create', verifyToken, createInventory);

// Get shop inventory
router.get('/get/:shopid', verifyToken, getInventoryByShopID)

// Get all Inventory
router.get('/get', verifyToken, getInventory);

// Get single Inventory
router.get('/get/:Inventoryid', verifyToken, getSingleInventory);

// Update Inventory
router.put('/update/:Inventoryid', verifyToken, updateInventory);

// Delete Inventory
router.delete('/delete/:Inventoryid', verifyToken, deleteInventory);

export default router;