import express from 'express';
import userController from '../controllers/user.controller';
import { loginUserValidation, registerUserValidation, userAuthValidation } from '../middleware/validation';

const router = express.Router();

router.post('/register', registerUserValidation, userController.registerUser)
router.post('/login', loginUserValidation, userController.loginUser)
router.post('/logout', userAuthValidation, userController.logoutUser)

router.get('/home', userAuthValidation)


export default router;