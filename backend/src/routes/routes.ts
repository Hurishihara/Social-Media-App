import express from 'express';
import userController from '../controllers/user.controller';
import { loginUserValidation, registerUserValidation } from '../middleware/validation';

const router = express.Router();

router.post('/register', registerUserValidation, userController.registerUser)
router.post('/login', loginUserValidation, userController.loginUser)

export default router;