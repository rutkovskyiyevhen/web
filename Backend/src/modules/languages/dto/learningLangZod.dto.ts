import { z } from 'zod';

export const learningLangSchema = z.object({
    learningLangs: z.array(z.string()).nonempty()
}).required();

export type LearningLangZodDto = z.infer<typeof learningLangSchema>;