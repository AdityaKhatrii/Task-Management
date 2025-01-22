import prisma from "../model/prisma";
import { Request, Response } from "express";
import { taskSchemaZod,taskSchema } from "../schemas/taskSchema";
export const addTask = async(req:Request,res:Response):Promise<any> =>{
    try {
        const task:taskSchema = req.body
        return res.status(200).json({
            msg:"task added successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error
        })
    }
}
