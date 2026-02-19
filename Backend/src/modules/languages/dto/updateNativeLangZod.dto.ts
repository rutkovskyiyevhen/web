import { z } from 'zod';

export const updateNativeLangSchema = z.object({
    nativeLang: z.string(),
}).required()

export type UpdateNativeLangZodDto = z.infer<typeof updateNativeLangSchema>;