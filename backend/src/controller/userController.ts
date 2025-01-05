import prisma from "../model/prisma";
import { Request,Response } from "express";

export const registerUser = async(req:Request,res:Response):Promise<any>=>{
    try {
        const {email,password} = req.body;
        const newUser = await prisma.user.create({
            data: { email, password },
          });
          res.status(201).json(newUser);

    } catch (error) {
        console.log(error)
        res.status(500).json({
            error:"Error creating user"
        })
    }
}

export const signInUser = async(req:Request,res:Response):Promise<any>=>{
    try {
        const {email,password} = req.body;
        const user = await prisma.user.findFirst({where:{
            email,
        }});
        if(!user){
            return res.status(404).json({
                error: 'User not found invalid email'
            });
        }
        if(user.password != password ){
            return res.status(404).json({
                error:'incorrect password '
            });
        }
        
        res.status(200).json({
            message: 'Sign-in successful', user
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error:"Signin Error "
        })
    }
}
