import { Router } from "express";
import { loginUser, signupUser } from "../controllers/user.controller";

const userRouter : Router = Router();

userRouter.route('/signup').post(signupUser);
userRouter.route('/login').get(loginUser);


export default userRouter;