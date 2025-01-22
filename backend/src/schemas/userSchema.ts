import zod from "zod";
import { taskSchemaZod } from "./taskSchema";

export const userSchemaZod = zod.object({
    id : zod.number().optional(),
    email : zod.string().email().optional(),
    password : zod.string(),
    tasks : zod.array(taskSchemaZod).optional()
})


export type userType =  zod.infer<typeof userSchemaZod>;