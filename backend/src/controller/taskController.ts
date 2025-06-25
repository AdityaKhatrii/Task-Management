import prisma from "../model/prisma";
import { Request, Response } from "express";
import { taskSchemaZod,taskSchema } from "../schemas/taskSchema";
export const addTask = async(req:Request,res:Response):Promise<any> =>{
    try {
        const userId = req.body.user.id;
        console.log('inside add task, req body = ',req.body)
        const validatedData = taskSchemaZod.omit({id:true,userId:true}).parse(req.body);
        const task = await prisma.task.create({
            data:{
                ...validatedData,
                userId: userId,
            }
        })
        return res.status(201).json({
            msg:"task added successfully",task
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error
        })
    }
}
export const deleteTask = async(req:Request,res:Response):Promise<any>=>{
    try {
        const userId = req.body.user.id;
        const id = req.params.id 
        const taskId = parseInt(id); 
        if(isNaN(taskId)){
            throw new Error('Invalid task id')
        }
        const task = await prisma.task.findUnique({where:{
            id:taskId,
            userId:userId
        }});
        if(!task){ return res.status(401).json({error:"Task not found or unauthorized"})};
        const isDeleted = await prisma.task.delete({
            where:{
                id:taskId
            }
        });
        if(!isDeleted){throw new Error("db error")};
        return res.status(200).json({msg:"Task deleted successfully"}); 
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error
        })
    }
}


export const getTask = async(req:Request,res:Response):Promise<any>=>{
    try {
        const userId = req.body.user.id;
        const id = req.params.id;
        const taskId = parseInt(id); 
        if(isNaN(taskId)){
            throw new Error('Invalid task id')
        }
        const task = await prisma.task.findUnique({where:{
            id:taskId,
            userId:userId
        }});
        if(!task){ return res.status(401).json({error:"Task not found or unauthorized"})};
        return res.status(200).json(task);
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error
        })
    }
}
export const getAllTasks = async(req:Request,res:Response):Promise<any>=>{
    try {
        const userId = req.body.user.id; 
        const task = await prisma.task.findMany({where:{ 
            userId:userId
        }});
        if(!task){ return res.status(401).json({error:"No tasks found related to user"})};
        return res.status(200).json(task);
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error
        })
    }
}
export const updateTask = async(req:Request,res:Response):Promise<any> =>{
    try {
        const userId = req.body.user.id;
        const id = req.params.id;
        console.log('params = ',req.params)
        const taskId = parseInt(id); 
        if(isNaN(taskId)){
            throw new Error('Invalid task id')
        }
        let { title, description, dueDate, completed } = req.body;
        if (dueDate) {
            const parsedDate = new Date(dueDate);
            if (isNaN(parsedDate.getTime())) { 
                return res.status(400).json({ error: "Invalid dueDate format. Provide a valid date string." });
            }
            dueDate = parsedDate;  // Convert to Date object
        }
        const task = await prisma.task.findUnique({where:{
            id:taskId,
            userId:userId
        }});
        if (!task || task.userId !== userId) {
            return res.status(404).json({ error: "Task not found or unauthorized" });
        }
        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: {
                title: title || task.title,
                description: description ?? task.description,
                dueDate: dueDate ?? task.dueDate,
                completed: completed ?? task.completed,
            },
        });
        if(!updatedTask){
            return res.status(400).json({error:"db error unable to update task"})
        }
        return res.status(201).json({
            msg:"task updated successfully",oldTask:task,updatedTask
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error
        })
    }
}