import { z } from 'zod';
import { loginSchema } from './loginZod.dto';

export const registrationSchema = loginSchema.extend({
    userName: z.string({message: 'It must be string'}).min(3).max(15),
    nativeLang: z.string(),
    learningLang: z.string()
}).required()

export type RegistrationZodDto = z.infer<typeof registrationSchema>;