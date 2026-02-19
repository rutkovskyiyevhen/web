import { z } from 'zod';

export const verifiedSchema = z
    .object({
        email: z.string().email(),
        code: z.string().length(6),
    })
    .required()

export type VerifiedZodDto = z.infer<typeof verifiedSchema>;