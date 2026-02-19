import { z } from 'zod';

export const resetPasswordSchema = z
    .object({
        email: z.string().email(),
    })
    .required()

export type ResetPasswordZodDto = z.infer<typeof resetPasswordSchema>;