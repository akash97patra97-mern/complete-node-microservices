import { NextFunction, Request, Response } from 'express';

export class ApiError extends Error {
    statusCode: number;
    isOperational: boolean;
    constructor(message: string, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        Error.captureStackTrace(this, this.constructor)
    }

}


export const errorhandler = (err: Error | ApiError, req: Request, res: Response, next: NextFunction) => {
    let customError = err;

    if (!(err instanceof ApiError)) {
        customError = new ApiError(err.message || "Something went wrong", 500, false)
    }

    const apiError = customError as ApiError;

    res.status(apiError.statusCode).json({
        success: false,
        message: apiError.message,
        ...(process.env.NODE_ENV === "development" && { stack: apiError.stack }),
    });
}