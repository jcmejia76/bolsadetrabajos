import { z } from "zod";

export const staffInviteSchema = z.object({
  email: z.email("Correo inválido"),
  jobTitle: z.string().trim().max(100).optional().or(z.literal("")),
});

export type StaffInviteInput = z.infer<typeof staffInviteSchema>;

export const acceptInvitationSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

export type AcceptInvitationInput = z.infer<typeof acceptInvitationSchema>;
