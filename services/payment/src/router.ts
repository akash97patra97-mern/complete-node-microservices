import express from 'express';
import { cancelPaymentApi, createpaymentApi, getAllPaymentsApi, getPaymentDataApi, updatePaymentApi } from './controller.js';

const router = express.Router();

router.post('/createPayment', createpaymentApi)
router.get('/getAllPayments', getAllPaymentsApi)
router.patch('/updateUserPayment', updatePaymentApi)
router.delete('/cancelUserPayment', cancelPaymentApi)
router.get('/getUserPayment/:id',getPaymentDataApi)

export default router;