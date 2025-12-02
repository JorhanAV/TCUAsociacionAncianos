import { Router } from "express";
import { DashboardController } from "../controllers/dashboardController";

export class DashboardRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new DashboardController();

    router.get("/kpis", controller.getKPIs.bind(controller));
    router.get("/charts", controller.getCharts.bind(controller));
    router.get("/alerts", controller.getAlerts.bind(controller));

    return router;
  }
}