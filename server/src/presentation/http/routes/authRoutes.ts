import { FastifyInstance } from "fastify";
import { getInstance } from "@/dependencies/container";
import { AuthController } from "@/presentation/http/controllers/authController";

export function authRoutes(app: FastifyInstance): void {
    const authController = getInstance(AuthController);
    
    app.post("/register", {

        handler: authController.register,
    });
    app.post("/login", authController.login);
    app.post("/logout", authController.logout); 
    app.get("/me", authController.getCurrentUser);
}
