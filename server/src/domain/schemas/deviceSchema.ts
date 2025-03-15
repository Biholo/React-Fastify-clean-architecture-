import { z } from "zod";

export const deviceSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  ip: z.string().min(1).max(255).optional(),
});

export type DeviceSchema = z.infer<typeof deviceSchema>;
