import { Repository } from "@/dependencies/constants";
import { bindIdentifier } from "@/dependencies/container";
import { UserRepository, TokenRepository } from "@/domain/gateway";
import { UserMySqlRepository, TokenMySqlRepository } from "@/infrastructure/database/repositories/";

export function bindRepositories() {
    bindIdentifier<UserRepository>(Repository.UserRepository, UserMySqlRepository);
    bindIdentifier<TokenRepository>(Repository.TokenRepository, TokenMySqlRepository);
}

