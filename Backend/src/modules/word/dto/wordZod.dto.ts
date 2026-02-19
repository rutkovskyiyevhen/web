import { z } from 'zod';

export const wordSchema = z
    .object({
        idLang: z.number(),
        lang: z.string(),
        word: z.string().max(50).min(1),
        translation: z.string().max(100).min(1)
    })
    .required()

export type WordZodDto = z.infer<typeof wordSchema>;