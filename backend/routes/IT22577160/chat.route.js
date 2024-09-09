import express from 'express';
import { chats } from '../../controllers/IT22577160/chat.controller.js';

const router = express.Router();

router.post('/chats', chats);

export default router;