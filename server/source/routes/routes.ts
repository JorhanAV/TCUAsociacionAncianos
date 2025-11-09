import { Router } from "express";
import { InventarioRoutes } from "./inventario.routes";
import { HistorialInventarioRoutes } from "./historialInventario.routes";
import { PerfilRoutes } from "./perfiles.routes";


export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    // ----Agregar las rutas----
    // Ruta de inventario

    // localhost:3000/inventario/
    router.use("/inventario", InventarioRoutes.routes);

    router.use("/historial", HistorialInventarioRoutes.routes);
     // localhost:3000/perfiles/
    router.use("/perfiles", PerfilRoutes.routes);
    return router;
  }
}
