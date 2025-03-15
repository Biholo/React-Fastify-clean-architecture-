import { UserRepository } from "@/domain/gateway";
import { injectable } from "inversify";
import { PrismaClient } from "@prisma/client";
import { AsyncOption } from "@/types/AsyncOption";
import { User } from "@/domain/entities/user";
import { Some, None } from "@thames/monads";
import { Role } from "@/domain/enum/roles";

const prisma = new PrismaClient();

@injectable()
export class UserMySqlRepository implements UserRepository {

    constructor(

    ) {}

    private mapToUser(prismaUser: any): User {
        return {
            ...prismaUser,
            roles: JSON.parse(prismaUser.roles) as Role[]
        };
    }

    async findByEmail(email: string): AsyncOption<User> {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return None;
        }

        return Some(this.mapToUser(user));
    }

    async findById(id: string): AsyncOption<User> {
        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            return None;
        }

        return Some(this.mapToUser(user));
    }

    async create(user: User): Promise<User> {
        const createdUser = await prisma.user.create({
            data: {
                ...user,
                roles: JSON.stringify(user.roles)
            },
        });

        return this.mapToUser(createdUser);
    }
}

