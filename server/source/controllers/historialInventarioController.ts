import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/custom.error";
import {
  ECategoria,
  EMovimientoInventario,
  PrismaClient,
} from "../../generated/prisma";

export class HistorialInventarioController {
  prisma = new PrismaClient();

  get = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const historial = await this.prisma.historialInventario.findMany({
        select: {
          id: true,
          fecha: true,
          descripcion: true,
          tipoMovimiento: true,
          inventario: {
            select: {
              Nombre: true,
            },
          },
          usuario: {
            select: { id: true, nombre_usuario: true },
          },
        },
        orderBy: { fecha: "desc" },
      });

      response.json(historial);
    } catch (error) {
      next(error);
    }
  };

  getAdmin = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      response.json();
    } catch (error) {
      next(error);
    }
  };

  //Obtener por Id
  getById = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      let idInventario = parseInt(request.params.id);
      const inventario = await this.prisma.inventario.findUnique({
        where: { id: idInventario },
        select: {
          id: true,
          Nombre: true,
          descripcion: true,
          stock: true,
          estado: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      response.json(inventario);
    } catch (error: any) {
      next(error);
    }
  };

  //Obtener por Id
  getByMovimiento = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const raw = (
        request.params.movimiento ??
        request.params.id ??
        ""
      ).toString();

      const movimiento = raw as EMovimientoInventario;
      if (!Object.values(EMovimientoInventario).includes(movimiento)) {
        return response.status(400).json({
          message: `Movimiento inválido. Usa uno de: ${Object.values(
            EMovimientoInventario
          ).join(", ")}`,
        });
      }

      const historial = await this.prisma.historialInventario.findMany({
        where: { tipoMovimiento: movimiento },
        select: {
          id: true,
          fecha: true,
          descripcion: true,
          tipoMovimiento: true,
          inventario: {
            select: {
              Nombre: true,
            },
          },
          usuario: {
            select: { id: true, nombre_usuario: true },
          },
        },
        orderBy: { fecha: "desc" },
      });
      response.json(historial);
    } catch (error: any) {
      next(error);
    }
  };

  //Crear
  create = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const body = request.body;

      const nuevoMovimiento = await this.prisma.historialInventario.create({
        data: {
          descripcion: body.descripcion,
          tipoMovimiento: body.tipoMovimiento,
          idInventario: body.idInventario,
          idUsuario: body.idUsuario,
        },
      });

      response.status(201).json(nuevoMovimiento);
    } catch (error) {
      next(error);
    }
  };

  update = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const idInventario = parseInt(request.params.id);
      const body = request.body;

      const inventarioActualizado = await this.prisma.inventario.update({
        where: { id: idInventario },
        data: {
          Nombre: body.Nombre,
          descripcion: body.descripcion,
          stock: body.stock,
          estado: body.estado,
          idCategoria: body.idCategoria,
        },
      });

      response.status(200).json(inventarioActualizado);
    } catch (error: any) {
      next(error);
    }
  };
}
