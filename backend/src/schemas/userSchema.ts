import zod from "zod";
import { taskSchema } from "./taskSchema";

export const userSchemaZod = zod.object({
    id : zod.number().optional(),
    email : zod.string().email().optional(),
    password : zod.string(),
    tasks : zod.array(taskSchema).optional()
})


export type userType =  zod.infer<typeof userSchemaZod>;