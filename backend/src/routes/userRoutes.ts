import { Router ,Request,Response} from "express";
import { registerUser,signInUser } from "../controller/userController";
const userRouter = Router();

userRouter.post("/register",registerUser);
userRouter.post("/signin",signInUser)

export default userRouter