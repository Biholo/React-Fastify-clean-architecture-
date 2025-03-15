import { bindIdentifier } from "@/dependencies/container";
import { UseCase } from "@/dependencies/constants";

import { AuthUseCase } from "@/domain/usecases/authUseCase";
import { AuthApplicationUseCase } from "@/application/usecases/authApplicationUseCase";

export function bindUseCases() {
    bindIdentifier<AuthUseCase>(UseCase.AuthUseCase, AuthApplicationUseCase);
}

