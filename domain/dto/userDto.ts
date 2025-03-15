import { Serialize } from "@domain/types/Serialize";
import { z } from "zod";

export const userSchema = z.object({
    id: z.string(),
    email: z.string(),
    username: z.string(),
    identifierName: z.string(),
    roles: z.array(z.string()),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type UserSchema = z.infer<typeof userSchema>;
export type UserDto = Serialize<UserSchema>;
