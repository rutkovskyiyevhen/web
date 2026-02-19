import { z } from 'zod';

export const changePrioritySchema = z.object({
    langs: z.array(z.string())
}).required();

export type ChangePriorityZodDto = z.infer<typeof changePrioritySchema>;