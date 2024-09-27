import express from 'express';
import { verifyToken } from '../../utils/verifyToken.js';
import { createItem, deleteOrders, getOrderListing, updateOrder } from '../../controllers/IT22607232_Controllers/s_OrderController.js';

const router = express.Router();

router.post('/create', verifyToken, createItem)
router.get('/orderListings', verifyToken, getOrderListing);
router.delete('/deleteOrder/:postId/:userId', verifyToken, deleteOrders);
router.put('/updateOrder/:postId/:userId', verifyToken, updateOrder);

export default router;