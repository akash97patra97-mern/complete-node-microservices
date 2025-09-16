import express from 'express';
import { createAddressApi, deleteAddressApi, getAddressApi, getAllAddressesApi, getUserAddressApi, updateUserAddressApi } from './controller.js';

const router = express.Router();

router.post('/createAddress', createAddressApi)
router.get('/getAllAddress', getAllAddressesApi)
router.patch('/updateUserAddress', updateUserAddressApi)
router.delete('/deleteAddress', deleteAddressApi)
router.get('/getAddress/:id',getAddressApi)
router.get('/getUserAddress/:id',getUserAddressApi)

export default router;