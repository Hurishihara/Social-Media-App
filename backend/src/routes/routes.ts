import express from 'express';
import userController from '../controllers/user.controller';
import { loginUserValidation, registerUserValidation, userAuthValidation } from '../middleware/validation';

const router = express.Router();

router.post('/register', registerUserValidation, userController.registerUser)
router.post('/login', loginUserValidation, userController.loginUser)
router.post('/logout', userAuthValidation, userController.logoutUser)

router.get('/check-auth', userAuthValidation,  (req, res) => {
    res.status(200).json({ message: 'Authenticated' });
})



export default router;