import { Request, Response } from "express";
import notificationService from "../services/notification.service";

class NotificationController {
    async getNotifications(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.query;
            console.log('Notification controller userId', userId)
            const notifications = await notificationService.getNotifications(Number(userId))
            console.log('Notification controller notifications', notifications)
            res.status(200).json(notifications)
        }
        catch (err) {
            console.error('Error getting notifications', err)
            res.status(500).json({ message: 'Error getting notifications' })
        }
    }
}

export default new NotificationController();