import { bindRepositories } from "@/dependencies/bindRepositories";
import { bindControllers } from "@/dependencies/bindControllers";
import { bindServices } from "@/dependencies/bindServices";
import { bindUseCases } from "@/dependencies/bindUseCases";

export function loadDependencies() {
    bindRepositories();
    bindControllers();
    bindServices();
    bindUseCases();
}
