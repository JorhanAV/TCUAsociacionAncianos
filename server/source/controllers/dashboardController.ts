import { PrismaClient, EMovimientoInventario } from "../../generated/prisma";
import { Request, Response } from "express";

export class DashboardController {
  prisma = new PrismaClient();

  // ===== KPIs =====
  async getKPIs(req: Request, res: Response) {
    try {
      const [
        activos,
        inactivos,
        actividadMasFrecuente,
        movimientosHoy
      ] = await Promise.all([
        this.prisma.perfiles.count({ where: { estado: "ACTIVO" } }),
        this.prisma.perfiles.count({ where: { estado: "INACTIVO" } }),

        // Actividad más frecuente
        this.prisma.actividad.groupBy({
          by: ["tipoActividad"],
          _count: { tipoActividad: true },
          orderBy: { _count: { tipoActividad: "desc" } },
          take: 1
        }),

        // Movimientos de inventario hoy
        this.prisma.historialInventario.groupBy({
          by: ["tipoMovimiento"],
          where: {
            fecha: {
              gte: new Date(new Date().setHours(0,0,0,0)),
            }
          },
          _count: { tipoMovimiento: true }
        }),
      ]);

      const movs = {
        ADD: movimientosHoy.find(m => m.tipoMovimiento === "ADD")?._count.tipoMovimiento ?? 0,
        DELETE: movimientosHoy.find(m => m.tipoMovimiento === "DELETE")?._count.tipoMovimiento ?? 0
      };

      res.json({
        perfiles: { activos, inactivos },
        actividadMasFrecuente: actividadMasFrecuente[0] ?? null,
        movimientosHoy: movs
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error obteniendo KPIs" });
    }
  }

  // ===== CHARTS =====
  async getCharts(req: Request, res: Response) {
    try {
      // Perfiles por rol
      const perfilesRol = await this.prisma.perfiles.groupBy({
        by: ["rol"],
        _count: { rol: true }
      });

      // Actividades por tipo
      const actividadesTipo = await this.prisma.actividad.groupBy({
        by: ["tipoActividad"],
        _count: { tipoActividad: true }
      });

      // Actividades por fecha (line chart)
      const actividadesFecha = await this.prisma.actividad.groupBy({
        by: ["fechaActividad"],
        _count: { fechaActividad: true },
        orderBy: { fechaActividad: "asc" }
      });

      // Inventario ADD vs DELETE
      const movimientosInventario = await this.prisma.historialInventario.groupBy({
        by: ["tipoMovimiento"],
        _count: { tipoMovimiento: true }
      });

      res.json({
        perfilesRol,
        actividadesTipo,
        actividadesFecha,
        movimientosInventario
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error obteniendo gráficos" });
    }
  }

  // ===== ALERTAS INTELIGENTES =====
  async getAlerts(req: Request, res: Response) {
    try {
      const [
        inventarioCritico,
        perfilesInactivos,
        actividadesProximas,
      ] = await Promise.all([
        this.prisma.inventario.findMany({ where: { stock: { lt: 10 } } }),
        this.prisma.perfiles.findMany({ where: { estado: "INACTIVO" } }),
        this.prisma.actividad.findMany({
          where: {
            fechaActividad: {
              gte: new Date(),
              lte: new Date(Date.now() + 3 * 86400000)   // próximos 3 días
            }
          }
        }),
      ]);

      res.json({
        inventarioCritico: inventarioCritico.length,
        perfilesInactivos: perfilesInactivos.length,
        actividadesProximas: actividadesProximas.length
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error generando alertas" });
    }
  }
}
