import express, { Application,Request,Response } from "express";
import userRouter from "./routes/userRoutes";
const app: Application = express();
const PORT = 3000

app.use(express.json());

app.get('/',(req:Request,res:Response)=>{
    res.send('Welcome to my task manager api');
})

app.use("/api/user",userRouter);


app.listen(PORT,()=>{
    console.log('server running at ',PORT);
})