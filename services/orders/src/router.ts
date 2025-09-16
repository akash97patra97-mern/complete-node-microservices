import express from 'express';
import { createOrderApi, deleteOrderApi, getAllOrdersApi, getOrderDataApi, updateOrderApi } from './controller.js';

const router = express.Router();

router.post('/createOrder', createOrderApi)
router.get('/getAllOrders', getAllOrdersApi)
router.patch('/updateOrder', updateOrderApi)
router.delete('/deleteOrder', deleteOrderApi)
router.get('/getOrder/:id',getOrderDataApi)

export default router;