import { NextFunction, Request, Response } from 'express';
import { createPayment, cancelPayment, findOrderPayment, listAllPayments, updateOrderPayment } from './paymentModel.js';
import { ApiError } from './errorHandler.js';


const createpaymentApi = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { order_id,
            status,
            amount } = req.body

        const result = await createPayment(order_id,
            status,
            amount)

        console.log("result", result)
        res.send({ message: "Payment created", data: result })
    } catch (error: any) {
        next(new ApiError(error.detail, error.length))
    }

}

const getAllPaymentsApi = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const offset = parseInt(req.query.offset as string);
        const limit = parseInt(req.query.limit as string);
        const result = await listAllPayments(offset,limit);
        res.send({ message: "List of all payments", data: result.rows })
    } catch (error: any) {
        next(new ApiError(error.detail, error.length))
    }

}

const getPaymentDataApi = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const order_id = req.params.order_id

        const result = await findOrderPayment(parseInt(order_id))

        res.send({ message: "Payment data fetched", data: result.rows })
    } catch (error: any) {
        next(new ApiError(error.detail, error.length))
    }

}

const updatePaymentApi = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { order_id, field, value } = req.body

        const result = await updateOrderPayment(order_id,
            field,
            value)

        res.send({ message: "Payment updated", data: result })
    } catch (error: any) {
        next(new ApiError(error.detail, error.length))
    }

}


const cancelPaymentApi = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const order_id = req.params.order_id
        const result = await cancelPayment(order_id);
        console.log(result)
        res.send({ message: "payment deleted", data: result })
    } catch (error: any) {
        next(new ApiError(error.detail, 500))
    }

}


export { createpaymentApi, getAllPaymentsApi, updatePaymentApi, cancelPaymentApi, getPaymentDataApi }