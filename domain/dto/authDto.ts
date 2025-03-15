import { Serialize } from "@domain/types/Serialize";
import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(255),
  username: z.string().min(2).max(255),
  identifierName: z.string().min(2).max(255),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
export type RegisterDto = Serialize<RegisterSchema>;



export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(255),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type LoginDto = Serialize<LoginSchema>;


export const logoutSchema = z.object({
  token: z.string().min(1),
});

export type LogoutSchema = z.infer<typeof logoutSchema>;
export type LogoutDto = Serialize<LogoutSchema>;