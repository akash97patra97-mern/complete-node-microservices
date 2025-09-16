import express from 'express';
import { createProductApi, getAllProductsApi, getProductDataApi, updateProductApi, deleteProductApi } from './controller.js';

const router = express.Router();

router.post('/createProduct', createProductApi)
router.get('/getAllProducts', getAllProductsApi)
router.patch('/updateProduct', updateProductApi)
router.delete('/deleteProduct', deleteProductApi)
router.get('/getProduct/:id',getProductDataApi)

export default router;