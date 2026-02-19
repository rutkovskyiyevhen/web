import { z } from "zod";


export const updateWordSchema = z
    .object({
        word: z.string().min(1).max(50).optional(),
        translation: z.string().min(1).max(100).optional(),
    })
    .strict()

export type UpdateWordZodDto = z.infer<typeof updateWordSchema>;