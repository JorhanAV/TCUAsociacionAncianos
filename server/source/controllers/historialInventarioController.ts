import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/custom.error";
import { ECategoria, PrismaClient } from "../../generated/prisma";

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
  getByCategoria = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const raw = (
        request.params.categoria ??
        request.params.id ??
        ""
      ).toString();

      const categoria = raw as ECategoria;
      if (!Object.values(ECategoria).includes(categoria)) {
        return response.status(400).json({
          message: `Categoría inválida. Usa una de: ${Object.values(
            ECategoria
          ).join(", ")}`,
        });
      }

      const inventario = await this.prisma.inventario.findMany({
        where: { idCategoria: categoria },
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

  //Crear
  create = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const body = request.body;

      const nuevoInventario = await this.prisma.inventario.create({
        data: {
          Nombre: body.Nombre,
          descripcion: body.descripcion,
          stock: body.stock,
          estado: body.estado,
          idCategoria: body.idCategoria,
        },
      });

      response.status(201).json(nuevoInventario);
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
