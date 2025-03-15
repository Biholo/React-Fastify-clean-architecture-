import { Token } from "@/domain/entities/token";
import { AsyncOption } from "@/types/AsyncOption";
import { CreateToken } from "@/domain/entities/token";

export interface TokenRepository {
    findByToken(token: string): AsyncOption<Token>;
    findByUserId(userId: string): AsyncOption<Token>;
    create(token: CreateToken): Promise<Token>;
    delete(token: string): Promise<void>;
}

