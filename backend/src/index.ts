import express, { Application,Request,Response } from "express";
import userRouter from "./routes/userRoutes";
import dotenv from "dotenv";
import cors from "cors";
import taskRouter from "./routes/taskRoutes";
dotenv.config();
if (!process.env.DB_URL || !process.env.JWT_SECRET) {
    console.log(process.env);
    // throw new Error("Missing required environment variables (DB_URL or JWT_SECRET)");
}
const app: Application = express();
const PORT = 3000

app.use(express.json());
app.use(cors());

app.get('/',(req:Request,res:Response)=>{
    res.send('Welcome to my task manager api');
})

app.use("/api/user",userRouter);
app.use("/api/task",taskRouter);

app.listen(PORT,()=>{
    console.log('server running at ',PORT);
})