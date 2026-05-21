import { z } from "zod";

export const listAccountsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  tag: z.string().trim().max(100).optional(),
  isPersonal: z.enum(["Y", "N", "ALL"]).optional(),
});

export type ListAccountsQuery = z.infer<typeof listAccountsQuerySchema>;
