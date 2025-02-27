import { NextFunction, Request, Response } from "express";
import notificationService from "../services/notification.service";
import CustomError from "../utils/error";
import { StatusCodes } from "http-status-codes";

class NotificationController {
    async getNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId } = req.query;
            const notifications = await notificationService.getNotifications(Number(userId));
            res.status(200).json(notifications);
        }
        catch {
            next(new CustomError('Something went happened', 'Internal Server Error', StatusCodes.INTERNAL_SERVER_ERROR));
            return;
        }
    }
}

export default new NotificationController();