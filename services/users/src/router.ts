import express from 'express';
import { createUserApi, deleteUserApi, getAllUsersApi, getUserDataApi, updateUserApi } from './controller.js';

const router = express.Router();

router.post('/createUser', createUserApi)
router.get('/getAllUsers', getAllUsersApi)
router.patch('/updateUser', updateUserApi)
router.delete('/deleteUser', deleteUserApi)
router.get('/getUser/:id',getUserDataApi)

export default router;