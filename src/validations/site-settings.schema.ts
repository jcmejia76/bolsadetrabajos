import { z } from "zod";

export const maintenanceModeSchema = z.object({
  enabled: z.boolean(),
  message: z.string().trim().max(500).nullable().optional(),
});

export type MaintenanceModeInput = z.infer<typeof maintenanceModeSchema>;
