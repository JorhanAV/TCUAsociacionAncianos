import { Router } from "express";
import { InventarioRoutes } from "./inventario.routes";
import { HistorialInventarioRoutes } from "./historialInventario.routes";
import { PerfilRoutes } from "./perfiles.routes";
import { ActividadesRoutes } from "./actividades.routes";
import { ImageRoutes } from "./images.routes";
import { UsuarioRoutes } from "./usuario.routes";
import { DashboardRoutes } from "./dashboard.routes";


export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    // ----Agregar las rutas----

    // localhost:3000/usuario/
    router.use("/usuario", UsuarioRoutes.routes);

    // localhost:3000/inventario/
    router.use("/inventario", InventarioRoutes.routes);

    router.use("/historial", HistorialInventarioRoutes.routes);
    // localhost:3000/perfiles/
    router.use("/perfiles", PerfilRoutes.routes);

    router.use("/actividades", ActividadesRoutes.routes);
    // localhost:3000/imagenes/
    router.use("/imagenes", ImageRoutes.routes);
    
    router.use("/dashboard", DashboardRoutes.routes);
    return router;
  }
}
