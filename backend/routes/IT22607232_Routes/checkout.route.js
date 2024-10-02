import express from 'express';
import { checkout } from '../../controllers/IT22607232_Controllers/checkout.controller.js';

const router = express.Router();

router.post('/creteCheckout', checkout);

export default router;