import { NextFunction, Request, Response } from 'express';
import { createOrder, listAllOrders, findOrder, updateOrderField, deleteOrders } from './orderModel.js';
import { ApiError } from './errorHandler.js';
import { publishQueue } from './discoverService.js';

const validateProducts = (products: any[]) => {
    console.log("product check", products)
    if (!Array.isArray(products)) throw new Error("Products is not an array.")

    const areAllProductsValid = products.every(e => {
        return typeof e.name === 'string' &&
            typeof e.quantity === 'number' &&
            typeof e.price === 'number';
    });

    if (!areAllProductsValid) {
        throw new Error("Products array contains one or more invalid objects.");
    }

    return true;
}

const createOrderApi = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { user_id,
            products,
            total_quantity,
            total_price } = req.body

        if (!validateProducts(products)) {
            throw new Error("Invalid product data provided.");
        }

        const result = await createOrder({user_id,
            products,
            total_quantity,
            total_price})

        console.log("result", result)

        await publishQueue("payment-queue",{
            order_id:result.id,
            status: 'pending',
            amount: total_price
        })

        res.send({ message: "Order created"})
    } catch (error: any) {
        console.log("error in order", error)
        next(new ApiError(error.message || "Unknown error", 500));

    }

}

const getAllOrdersApi = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await listAllOrders()
        res.send({ message: "List of all Orders", data: result.rows })
    } catch (error: any) {
        next(new ApiError(error.detail, error.length))
    }

}

const getOrderDataApi = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id

        const result = await findOrder(id)

        res.send({ message: "Order data fetched", data: result.rows })
    } catch (error: any) {
        next(new ApiError(error.detail, error.length))
    }

}

const updateOrderApi = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, field, value } = req.body

        const result = await updateOrderField(id,
            field,
            value)

        res.send({ message: "Order updated", data: result })
    } catch (error: any) {
        next(new ApiError(error.detail, error.length))
    }

}


const deleteOrderApi = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id  = parseInt(req.params.id);
        const result = await deleteOrders(id);
        console.log(result)
        res.send({ message: "Order deleted", data: result })
    } catch (error: any) {
        next(new ApiError(error.detail, 500))
    }

}


export { createOrderApi, getAllOrdersApi, updateOrderApi, deleteOrderApi, getOrderDataApi }