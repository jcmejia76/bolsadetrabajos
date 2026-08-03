import { z } from "zod";

export const reasonSchema = z.object({
  reason: z.string().trim().min(10, "El motivo debe tener al menos 10 caracteres").max(1000),
});

export type ReasonInput = z.infer<typeof reasonSchema>;
