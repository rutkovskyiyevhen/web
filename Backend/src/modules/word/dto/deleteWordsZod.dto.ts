import { z } from 'zod';

export const deleteWordsSchema = z.object({
  wordsId: z.array(z.number().int().positive()).nonempty("At least one ID is required"),
  langId: z.number(),
});

export type DeleteWordsZodDto = z.infer<typeof deleteWordsSchema>;
