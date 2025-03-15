import { AuthController } from "@/presentation/http/controllers/authController";
import { bindSelf } from "@/dependencies/container";

export function bindControllers() {
    bindSelf(AuthController);
}
