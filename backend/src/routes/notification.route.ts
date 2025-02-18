import { Router } from 'express'
import { userAuthValidation } from '../middleware/validation'
import notificationController from '../controllers/notification.controller'

const notificationRouter = Router()

notificationRouter.get('/notifications', userAuthValidation, notificationController.getNotifications)

export default notificationRouter