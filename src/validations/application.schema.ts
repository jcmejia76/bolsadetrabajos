import { z } from "zod";
import { ApplicationStatus } from "@/generated/prisma/enums";

export const updateApplicationStatusSchema = z.object({
  applicationId: z.string().min(1),
  status: z.enum(ApplicationStatus),
});

export const applicationNoteSchema = z.object({
  applicationId: z.string().min(1),
  note: z.string().trim().min(1, "La nota no puede estar vacía").max(2000),
});

export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>;
export type ApplicationNoteInput = z.infer<typeof applicationNoteSchema>;
