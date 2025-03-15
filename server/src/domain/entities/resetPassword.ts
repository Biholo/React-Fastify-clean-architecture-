import { ResetPasswordStatus } from "../enum/resetPasswordEnums";
import { User } from "./user";
    
export interface ResetPassword {
    id: string;
    email: string;
    token: string;
    userId: string;
    status: ResetPasswordStatus;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
    user: User;
}

