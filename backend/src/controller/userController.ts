import prisma from "../model/prisma";
import { Request, Response } from "express";
import jsonwebtoken, { Jwt } from "jsonwebtoken";
import bcrypt from "bcrypt"
const jwtSecret: string = process.env.JWT_SECRET ? process.env.JWT_SECRET : "";
const saltRounds: number = 10;

export const registerUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;
        const hashedPassword: string = await bcrypt.hash(password, saltRounds);
        const newUser = await prisma.user.create({
            data: { email, password: hashedPassword },
        });
        res.status(201).json(newUser);

    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: "Error creating user"
        })
    }
}
export type userType = {
    id: number,
    email: string,
    password: string,
    tasks?: any
}

export const signInUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;
        const user: userType | null = await prisma.user.findFirst({
            where: {
                email,
            }
        });
        if (!user) {
            return res.status(404).json({
                error: 'User not found invalid email'
            });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) { return res.status(404).json({ error: 'Incorrect password' }); }
        if (user.password != password) {
            return res.status(404).json({
                error: 'incorrect password '
            });
        }

        const token: string = jsonwebtoken.sign({
            email: user.email,
            id: user.id
        }, jwtSecret,
            { expiresIn: '1hr' });

        res.status(200).json({
            message: 'log in successful', user,
            token: token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: "Signin Error "
        })
    }
}
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const user: userType = req.body.user;
        const isUserExist = await prisma.user.findFirst( {
            where:{
                email:user.email,
                id: user.id
            }
           } );
        if(!isUserExist){
            return res.status(400).json({
                error: "user not found invalid data"
            })
        }
        const isDeleted = await prisma.user.delete({
            where: {
                id: user.id
            }
        });
        if (!isDeleted) {
            throw new Error("db error");
            }
        return res.status(200).json({
            msg:"user deleted successfully"
        })
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error:"Error unable to delete user"
        })
    }
}