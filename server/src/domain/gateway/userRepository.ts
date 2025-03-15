import { User, CreateUser } from "@/domain/entities/user";
import { AsyncOption } from "@/types/AsyncOption";

export interface UserRepository {
    findByEmail(email: string): AsyncOption<User>;
    findById(id: string): AsyncOption<User>;
    create(user: CreateUser): Promise<User>;
}

