import jwt from "jsonwebtoken";
import prisma from "../model/prisma";
import { Request, Response, NextFunction } from "express";
import { userType } from "../schemas/userSchema";

export const authMiddleware = (req: Request, res: Response, next: NextFunction):void => {
    try {
        console.log("auth middleware called");
        const jwtSecret: string = process.env.JWT_SECRET || "";
        const authHeader: string = req.headers.authorization ? req.headers.authorization : "";
        if(!authHeader || authHeader.length == 0)
        {
            console.log('auth header not found');
            console.log(' header = ',req.headers);
             res.status(401).json({
                error:"invalid or expired token"
            })
            return;
        }
        const token: string = authHeader.split(" ")[1]; 
        console.log('token = ',token);
        const decoded = jwt.verify(token, jwtSecret); 
        req.body.user = decoded as userType; 
        console.log(req.body.user)
        next(); 
    } catch (error) {
        console.log(error);
        res.status(403).json({
            error: "Auth error try to sign in again"
        })
    }

}