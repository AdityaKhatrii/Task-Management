import prisma from "../model/prisma";
import { Request, Response } from "express";
import jsonwebtoken, { Jwt } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { userSchemaZod, userType } from "../schemas/userSchema";
// const jwtSecret: string = process.env.JWT_SECRET ? process.env.JWT_SECRET : "";
const saltRounds: number = 10;

export const registerUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const jwtSecret: string = process.env.JWT_SECRET || "";
        const { email, password } = req.body;
         if(!email || !password){
          return res.status(400).json({
            error:"Both email and password are required"
          })
        }
        const isUserExists = await prisma.user.findFirst({
            where: { email: email }
        })
        if (isUserExists) {
            return res.status(403).json({
                error: "user with this email already exists"
            });
        }
        const hashedPassword: string = await bcrypt.hash(password, saltRounds);
        console.log(hashedPassword);
        const newUser = await prisma.user.create({
            data: { email, password: hashedPassword },
        });
        
        const token: string = jsonwebtoken.sign({
            email: newUser.email,
            id: newUser.id
        }, jwtSecret,
            { expiresIn: '30d' });

        res.status(200).json({
            message: 'Account created successfully', newUser,
            token: token
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: "Error creating user"
        })
    }
}


export const signInUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const jwtSecret: string = process.env.JWT_SECRET || "";
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({error:"missing email or password"})
        }
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
        

        const token: string = jsonwebtoken.sign({
            email: user.email,
            id: user.id
        }, jwtSecret,
            { expiresIn: '30d' });

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
export const deleteUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const user: userType = req.body.user;
        const isDeleted = await prisma.user.delete({
            where: {
                id: user.id
            }
        });
        if (!isDeleted) {
            throw new Error("db error");
        }
        return res.status(200).json({
            msg: "user deleted successfully"
        })

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error: "Error unable to delete user"
        })
    }
}

export const getUser = async (req: Request, res: Response): Promise<any> => {
    try {
       
        const user:userType = req.body.user;
        const isUserExists = await prisma.user.findFirst({where:{id:user.id}});
        if(!isUserExists){
            return res.status(404).json({error:"User not found"});
        }
        return res.status(200).json(isUserExists);

    } catch (error) {
        console.log(error);
        return res.status(404).json({
            error: 'User not found db error'
        });
    }

}

export const updateUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const user: userType = req.body.user;
        const { newMail, newPass } = req.body;
        if (!newMail && !newPass) {
            return res.status(401).json({
                error: "At least one of 'newMail' or 'newPass' is required"
            });
        }
        let newHashedPassword = user.password;
        if (newPass) {
            newHashedPassword = await bcrypt.hash(newPass, saltRounds);
        }
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                email: newMail ? newMail : user.email,
                password: newHashedPassword
            },
        });
        if (!updatedUser) {
            throw new Error("db error");
        }
        return res.status(200).json({
            msg: "User updated successfully"
        })

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            error: "Error while updating user"
        })
    }
}