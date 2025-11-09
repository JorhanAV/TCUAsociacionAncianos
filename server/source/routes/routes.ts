import { Router } from "express";
import { InventarioRoutes } from "./inventario.routes";


export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    // ----Agregar las rutas----
    // Ruta de inventario
    
    // localhost:3000/inventario/
    router.use("/inventario", InventarioRoutes.routes);


    return router;
  }
}
