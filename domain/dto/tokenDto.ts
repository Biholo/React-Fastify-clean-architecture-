import { Serialize } from "@domain/types/Serialize";
import { z } from "zod";

export const tokenSchema = z.object({
  accessToken: z.string().nonempty(),
  refreshToken: z.string().nonempty(),
});

export type TokenSchema = z.infer<typeof tokenSchema>;

export type TokenDto = Serialize<TokenSchema>;