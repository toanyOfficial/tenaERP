import { z } from "zod";

export const listBaseCodesQuerySchema = z.object({
  groups: z.string().trim().min(1, "groups는 필수입니다."),
});

export type ListBaseCodesQuery = z.infer<typeof listBaseCodesQuerySchema>;
