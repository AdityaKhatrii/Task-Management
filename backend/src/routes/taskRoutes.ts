import { Router ,Request,Response} from "express";
import { authMiddleware } from "../middlewares/auth";
import { addTask, deleteTask, getAllTasks, getTask, updateTask } from "../controller/taskController";
const taskRouter = Router();

taskRouter.get("/",authMiddleware,getAllTasks);
taskRouter.get("/:id",authMiddleware,getTask);
taskRouter.post("/add",authMiddleware,addTask);
taskRouter.post("/delete/:id",authMiddleware,deleteTask);
taskRouter.post("/update/:id",authMiddleware,updateTask);

export default taskRouter;