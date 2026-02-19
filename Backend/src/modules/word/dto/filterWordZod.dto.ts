import { z } from 'zod';
import { WordStatus } from '../../../common/enums/word-status.enum';

export const filterWordsSchema = z.object({
  idLang: z.number(),
  status: z.nativeEnum(WordStatus).optional(),
  order: z.enum(['asc', 'desc']).optional(),
});

export type FilterWordsZodDto = z.infer<typeof filterWordsSchema>;
