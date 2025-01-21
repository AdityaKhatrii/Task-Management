import zod from "zod";
export const taskSchema = zod.object({
    id: zod.number(), 
    title: zod.string(),
    description: zod.string().optional(), 
    dueDate: zod.date().optional(), 
    completed: zod.boolean(), 
    userId: zod.number(), // ID of the user who owns the task
});