import { TokenType } from "@/domain/enum/tokenEnums";
import { z } from "zod";

export const tokenCreateSchema = z.object({
  ownedBy: z.string(),
  token: z.string(),
  type: z.nativeEnum(TokenType),
  scopes: z.array(z.string()),
  deviceName: z.string().optional(),
  deviceIp: z.string().optional(),
  expiresAt: z.date(),
});

export const tokenSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
});



export type TokenSchema = z.infer<typeof tokenSchema>;
export type TokenCreate = z.infer<typeof tokenCreateSchema>;
