import { NextFunction, Request, Response } from 'express';
import { createProduct, findProduct, listAllProducts, updateProductField, deleteProduct } from './productModel.js';
import { ApiError } from './errorHandler.js';


const createProductApi = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name,
            price,
            company,
            description,
            inStock } = req.body

        const result = await createProduct(name,
            price,
            company,
            description,
            inStock)

        console.log("result", result)
        res.send({ message: "Product created", data: result })
    } catch (error: any) {
        next(new ApiError(error.detail, error.length))
    }

}

const getAllProductsApi = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await listAllProducts()
        res.send({ message: "List of all products", data: result.rows })
    } catch (error: any) {
        next(new ApiError(error.detail, error.length))
    }

}

const getProductDataApi = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id  = req.params.id

        const result = await findProduct(id)

        res.send({ message: "User data fetched", data: result.rows })
    } catch (error: any) {
        next(new ApiError(error.detail, error.length))
    }

}

const updateProductApi = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, field, value } = req.body

        const result = await updateProductField(id,
            field,
            value)

        res.send({ message: "User updated", data: result })
    } catch (error: any) {
        next(new ApiError(error.detail, error.length))
    }

}


const deleteProductApi = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        const result = await deleteProduct(email);
        console.log(result)
        res.send({ message: "User deleted", data: result })
    } catch (error: any) {
        next(new ApiError(error.detail, 500))
    }

}


export { createProductApi, deleteProductApi, updateProductApi, getAllProductsApi, getProductDataApi}