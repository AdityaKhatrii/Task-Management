import { Router ,Request,Response} from "express";
import { registerUser,signInUser,deleteUser,getUser,updateUser } from "../controller/userController";
import { authMiddleware } from "../middlewares/auth";
const userRouter = Router();

userRouter.post("/register",registerUser);
userRouter.post("/signin",signInUser);
userRouter.delete("/delete",authMiddleware,deleteUser);
userRouter.get("/get",authMiddleware,getUser);
userRouter.put("/update",authMiddleware,updateUser);

export default userRouter