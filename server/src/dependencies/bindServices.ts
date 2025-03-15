
import { Service } from "@/dependencies/constants";
import { bindIdentifier } from "@/dependencies/container";

import { AuthService } from "@/domain/services";
import { AuthApplicationService } from "@/application/services/";

export function bindServices() {
    bindIdentifier<AuthService>(Service.AuthService, AuthApplicationService);
}
