import { Router } from "express";
import { UsuarioController } from "../controllers/usuarioController";
import { authenticateJWT } from "../middleware/authMiddleware";
export class UsuarioRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new UsuarioController();

    router.get("/profile", authenticateJWT, controller.userAuth);

    //localhost:3000/usuario/
    router.get("/", controller.get);
    router.get("/verificar-correo", controller.verificarCorreo);

    router.get("/verificar-correo-update", controller.verificarCorreoUpdate);

    //localhost:3000/usuario/6
    router.get("/:id", controller.getById);

    router.post("/login", controller.login);
    //Crear
    router.post("/register", controller.register);

    router.put("/:id", controller.update);

    router.put("/:id/password", controller.cambiarContrasena);

    return router;
  }
}
