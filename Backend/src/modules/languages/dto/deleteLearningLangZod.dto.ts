import { z } from 'zod';

export const deleteLearningLangSchema = z.object({
    learningLangs: z.array(z.number()).nonempty()
}).required();

export type DeleteLearningLangZodDto = z.infer<typeof deleteLearningLangSchema>;