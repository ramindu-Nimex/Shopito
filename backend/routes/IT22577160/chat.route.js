import express from 'express';
import { chats, createInventoryItem, createShop, getFilteredProducts, userChats, userChatsByGetId, userChatsById } from '../../controllers/IT22577160/chat.controller.js';
import { verifyToken } from '../../utils/verifyToken.js';

const router = express.Router();

router.post('/chats', verifyToken, chats);
router.get('/userChats', verifyToken, userChats);
router.get('/userChats/:id', verifyToken, userChatsById);
router.put('/userChats/:id', verifyToken, userChatsByGetId);
router.get('/getAssist', verifyToken, getFilteredProducts);
router.post('/createInventory', verifyToken, createInventoryItem);
router.post('/createShop', verifyToken, createShop);

export default router;