import { z } from "zod";

export const personalProfileSchema = z.object({
  firstName: z.string().trim().max(80).optional().or(z.literal("")),
  lastName: z.string().trim().max(80).optional().or(z.literal("")),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  aboutMe: z.string().trim().max(2000).optional().or(z.literal("")),
});

export type PersonalProfileInput = z.infer<typeof personalProfileSchema>;
