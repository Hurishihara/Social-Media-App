import { Router } from 'express';
import userController from '../controllers/user.controller';
import { loginUserValidation, registerUserValidation, userAuthValidation } from '../middleware/validation';

const authRouter = Router();


authRouter.post('/register', registerUserValidation, userController.registerUser)
authRouter.post('/login', loginUserValidation, userController.loginUser)
authRouter.post('/logout', userAuthValidation, userController.logoutUser)
authRouter.get('/check-auth', userAuthValidation,  (req, res) => {
    res.status(200).json({ message: 'Authenticated' });
})

export default authRouter;