import { StatusCodes } from "http-status-codes";
import CustomError from "../utils/error";
import { Request, Response, NextFunction } from "express";
import { stat } from "fs";

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    let statusCode = res.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    let name = err.name || 'Internal Server Error';
    let message = err.message || 'Something went wrong';

    if (err instanceof CustomError) {
        statusCode = err.statusCode;
        name = err.name;
        message = err.message;
    }
    
    res.status(statusCode).json({
        name,
        message
    })
}

export default errorHandler;