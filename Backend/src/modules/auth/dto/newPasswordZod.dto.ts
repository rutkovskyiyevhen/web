import { z } from 'zod';

export const newPasswordSchema = z
    .object({
        email: z.string().email(),
        resetToken: z.string(),
        newPassword: z.string().min(4).max(15)
    })
    .required()

export type NewPasswordZodDto = z.infer<typeof newPasswordSchema>;