import { z } from "zod";

export const generateWordAISchema = z.object({
    quantity: z.number().min(1).max(15),
    level: z.string(),
    lang: z.string(),
    idLang: z.number()
}).required();

export type GenerateWordAIZodDto = z.infer<typeof generateWordAISchema>;