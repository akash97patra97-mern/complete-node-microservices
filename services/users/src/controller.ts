import { NextFunction, Request, Response } from 'express';
import { createUser, deleteUsers, findUser, listAllUsers, updateUserField } from './userModel.js';
import { ApiError } from './errorHandler.js';
import axios from 'axios';
import { discoverService, publishQueue } from './discoverService.js';


const createUserApi = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, phone, password,address } = req.body

        console.log(req.body)
        const result = await createUser(name, email, phone, password,);

        console.log("result", result)

        const addressServiceUrl = await discoverService("address-service");
        const url = `${addressServiceUrl}/api/createAddress`;
        console.log(`${addressServiceUrl}/api/createAddress`, result)
        const addressResult = await axios.post(url, {
            address,
            id: result.id,
        });

        console.log(addressResult)

        await publishQueue("address-queue", {
            address,
            id: result.id,
        })

        res.send({ message: "User created" })
    } catch (error: any) {
        next(new ApiError(error.detail, error.length))
    }

}

const getAllUsersApi = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = parseInt(req.query.offset as string) || 0;

        const users = (await listAllUsers(offset, limit)).rows
        let id;
        const addressUrl = await discoverService("address-service");
        const url = `${addressUrl}/api/getUserAddress/${id}`;

        const result = await Promise.all(users.map(async (user) => {
            try {
                id = user.id;
                const address = await axios.get(url);
                console.log(address)
                return { ...user, address: address.data }
            } catch (err: any) {
                console.error(`Failed to fetch addresses for user ${user.id}`, err.message);
                return { ...user, addresses: [] };
            }
        }))
        res.send({ message: "List of all users", data: result })
    } catch (error: any) {
        next(new ApiError(error.detail, error.length))
    }

}

const getUserDataApi = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id

        const result = await findUser(id)

        const addressServiceUrl = await discoverService("address-service");

        const url = `${addressServiceUrl}/api/getUserAddress/${id}`;

        const addressResult = await axios.get(url);
        res.send({ message: "User data fetched", data: { user: result.rows, address: addressResult.data } })
    } catch (error: any) {
        next(new ApiError(error.detail, error.length))
    }

}

const updateUserApi = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, field, value } = req.body

        const result = await updateUserField(id,
            field,
            value)

        res.send({ message: "User updated", data: result })
    } catch (error: any) {
        next(new ApiError(error.detail, error.length))
    }

}


const deleteUserApi = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        const result = await deleteUsers(email);
        console.log(result)
        res.send({ message: "User deleted", data: result })
    } catch (error: any) {
        next(new ApiError(error.detail, 500))
    }

}


export { createUserApi, getAllUsersApi, updateUserApi, deleteUserApi, getUserDataApi }