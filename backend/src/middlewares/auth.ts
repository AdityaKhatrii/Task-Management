import jsonwebtoken from "jsonwebtoken";
import prisma from "../model/prisma";
import { Request, Response, NextFunction } from "express";
import { userType } from "../schemas/userSchema";

const jwtSecret: string = process.env.JWT_SECRET ? process.env.JWT_SECRET : "";

export const authMiddleware = (req: Request, res: Response, next: NextFunction):void => {
    try {
        const authHeader: string = req.headers.authorization ? req.headers.authorization : "";
        if(!authHeader || authHeader.length == 0)
        {
             res.status(401).json({
                error:"invalid or expired token"
            })
            return;
        }
        const token: string = authHeader.split(" ")[1];
        const user2 = jsonwebtoken.verify(token, jwtSecret,(err,decoded)=>{
            if (err){
                return res.status(401).json({err:'Invalid token please sign in again'})
            }
            else {
                console.log(decoded);
                if (typeof decoded === 'object' && decoded !== null) 
                    { 
                        req.body.user = decoded as userType;
                        next();
                    }
                    else 
                    {
                    res.status(403).json({ error: 'Token decoding error' });
                    return;
            }}
        });

    } catch (error) {
        console.log(error);
        res.status(403).json({
            error: "Auth error try to sign in again"
        })
    }

}