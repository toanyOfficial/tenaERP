import { z } from "zod";

export const idMasterCreateSchema = z.object({
  title: z.string().trim().min(1).max(255),
  loginId: z.string().trim().min(1).max(255),
  useYn: z.enum(["Y", "N"]).optional(),
});
export const idMasterUpdateSchema = z.object({
  id: z.coerce.number().int().positive(),
  title: z.string().trim().min(1).max(255).optional(),
  loginId: z.string().trim().min(1).max(255).optional(),
  useYn: z.enum(["Y", "N"]).optional(),
}).strict();

export const passwordMasterCreateSchema = z.object({
  title: z.string().trim().min(1).max(255),
  password: z.string().min(1),
  authorityCode: z.string().trim().max(100).optional().or(z.literal("")),
  useYn: z.enum(["Y", "N"]).optional(),
  immutableYn: z.enum(["Y", "N"]).optional(),
});
export const passwordMasterUpdateSchema = z.object({
  id: z.coerce.number().int().positive(),
  title: z.string().trim().min(1).max(255).optional(),
  password: z.string().optional(),
  authorityCode: z.string().trim().max(100).optional().or(z.literal("")),
  useYn: z.enum(["Y", "N"]).optional(),
}).strict();
