import { Role } from "@/domain/enum/roles";

export type CreateUser = {
    email: string;
    password: string;
    username: string;
    identifierName: string;
}


export type User = CreateUser & {
    roles: Role[];
    createdAt: Date;
    updatedAt: Date;
    id: string;
}

export type UserJwtPayload = {
    id: string;
    email: string;
    roles: string[];
  };