import express from 'express';
import { verifyToken } from '../../utils/verifyToken.js';
import { createItem } from '../../controllers/IT22607232_Controllers/s_OrderController.js';

const router = express.Router();

router.post('/add',createItem);

export default router;