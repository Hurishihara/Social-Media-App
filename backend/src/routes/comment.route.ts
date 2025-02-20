import { Router } from "express";
import { userAuthValidation } from "../middleware/validation";
import commentController from "../controllers/comment.controller";

const commentRouter = Router();

commentRouter.post('/create-comment', userAuthValidation, commentController.createComment)

export default commentRouter;