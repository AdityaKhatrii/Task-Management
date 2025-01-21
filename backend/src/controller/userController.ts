import prisma from "../model/prisma";
import { Request, Response } from "express";
import jsonwebtoken, { Jwt } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { userSchemaZod ,userType} from "../schemas/userSchema";
const jwtSecret: string = process.env.JWT_SECRET ? process.env.JWT_SECRET : "";
const saltRounds: number = 10;

export const registerUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;
        const isUserExists = await prisma.user.findFirst({
            where :{email:email}
        })
        if(isUserExists){
            return res.status(403).json({
                error:"user with this email already exists"
            });
        }
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

export const getUser = async(req:Request,res:Response) =>{
    try {
        const {email,password} = req.body;
    const user = await prisma.user.findFirst({
        where:{ email }
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
    return res.status(200).json({
        user
    });

    } catch (error) {
        console.log(error);
        return res.status(404).json({
            error: 'User not found 404'
        });
    }

}

export const updateUser = async(req:Request,res:Response)=>{
    try {
        const user:userType = req.body.user;
        const {newMail,newPass} = req.body;
        if(!newMail && !newPass){
            return res.status(401).json({
                error:"At least one of 'newMail' or 'newPass' is required"
            });
        }
        let newHashedPassword = user.password;
        if(newPass){
            newHashedPassword = await bcrypt.hash(newPass,saltRounds);
        }
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                email: newMail?newMail:user.email,
                password:newHashedPassword
            },
        });
        if(!updatedUser){
            throw new Error("db error");
        }
        return res.status(200).json({
            msg:"User updated successfully"
        })

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            error:"Error while updating user"
        })
    }
}