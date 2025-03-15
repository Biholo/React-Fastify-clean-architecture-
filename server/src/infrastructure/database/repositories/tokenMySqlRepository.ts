import { TokenRepository } from "@/domain/gateway/tokenRepository";
import { injectable } from "inversify";
import { PrismaClient } from "@prisma/client";
import { Token, CreateToken } from "@/domain/entities/token";
import { TokenType } from "@/domain/enum/tokenEnums";
import { Some, None } from "@thames/monads";
import { AsyncOption } from "@/types/AsyncOption";

const prisma = new PrismaClient();

@injectable()
export class TokenMySqlRepository implements TokenRepository {
    constructor(

    ) {}

    private mapToToken(prismaToken: any): Token {
        return {
            ...prismaToken,
            type: prismaToken.type as TokenType,
            scopes: JSON.parse(prismaToken.scopes) as string[],
        };
    }

    async findByToken(token: string): AsyncOption<Token> {
        const tokenRecord = await prisma.token.findFirst({
            where: { token },
        });

        if (!tokenRecord) {
            return None;
        }

        return Some(this.mapToToken(tokenRecord));
    }

    async findByUserId(userId: string): AsyncOption<Token> {
        const tokenRecord = await prisma.token.findFirst({
            where: { ownedById: userId },
        });

        if (!tokenRecord) {
            return None;
        }

        return Some(this.mapToToken(tokenRecord));
    }

    async create(token: CreateToken): Promise<Token> {
        const createdToken = await prisma.token.create({
            data: {
                ...token,
                scopes: JSON.stringify(token.scopes)
            },
        });
        return this.mapToToken(createdToken);
    }

    async delete(token: string): Promise<void> {
        await prisma.token.deleteMany({
            where: { token },
        });
    }
}