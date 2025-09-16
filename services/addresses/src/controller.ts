import { NextFunction, Request, Response } from 'express';
import { createAddress, deleteAddress, findAddress, findAllAddressOfUser, listAllAddresses, updateUserAddress } from './addressModel.js';
import { ApiError } from './errorHandler.js';


const createAddressApi = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { address, id } = req.body
        console.log({ address, id })
        const result = await createAddress(address, id);

        res.send({ message: "Address created for user", data: result })
    } catch (error: any) {
        next(new ApiError(error.detail, error.length))
    }

}

const getAllAddressesApi = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await listAllAddresses()
        res.send({ message: "List of all addresses", data: result.rows })
    } catch (error: any) {
        next(new ApiError(error.detail, error.length))
    }

}

const getAddressApi = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id

        const result = await findAddress(Number(id))

        res.send({ message: "User addresses fetched", data: result.rows })
    } catch (error: any) {
        next(new ApiError(error.detail, error.length))
    }

}

const getUserAddressApi = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        console.log("user id", id)
        const result = await findAllAddressOfUser(Number(id))
        console.log('address result', result)
        res.send({ message: "User addresses fetched", data: result.rows })
    } catch (error: any) {
        next(new ApiError(error.detail, error.length))
    }

}

const updateUserAddressApi = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, address } = req.body

        const result = await updateUserAddress(id,
            address)

        res.send({ message: "User address updated", data: result })
    } catch (error: any) {
        next(new ApiError(error.detail, error.length))
    }

}


const deleteAddressApi = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const result = await deleteAddress(Number(id));
        res.send({ message: "User deleted", data: result })
    } catch (error: any) {
        next(new ApiError(error.detail, 500))
    }

}


export { createAddressApi, getAddressApi, deleteAddressApi, getUserAddressApi, getAllAddressesApi, updateUserAddressApi }