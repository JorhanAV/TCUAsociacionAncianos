import { Router } from "express";
import { PerfilesController } from "../controllers/perfilController";

export class PerfilRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new PerfilesController();

    // /perfiles
    router.get("/", controller.get);
    router.get("/:id", controller.getById);
    router.post("/", controller.create);
    router.put("/:id", controller.update);
    router.patch("/:id/estado", controller.setEstado);
    router.delete("/:id", controller.delete);

    // actividades <-> perfil
    router.get("/:id/actividades", controller.getActividades);
    router.post("/:id/actividades", controller.vincularActividad);
    router.delete("/:id/actividades/:idActividad", controller.desvincularActividad);

    return router;
  }
}
