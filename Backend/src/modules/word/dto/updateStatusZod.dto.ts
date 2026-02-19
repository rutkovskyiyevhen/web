import { WordStatus } from "../../../common/enums/word-status.enum";
import { z } from "zod";


export const updateStatusSchema = z
    .object({
        status: z.nativeEnum(WordStatus),
        wordsId: z.array(z.number().int().positive()).nonempty("At least one ID is required"),
        langId: z.number(),
    })
    .strict()


export type UpdateStatusZodDto = z.infer<typeof updateStatusSchema>;