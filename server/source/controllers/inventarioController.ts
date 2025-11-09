import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/custom.error";
import {
  ECategoria,
  EMovimientoInventario,
  PrismaClient,
} from "../../generated/prisma";

export class InventarioController {
  prisma = new PrismaClient();

  get = async (request: Request, response: Response, next: NextFunction) => {
    try {
      // 1. Obtener todos los productos con su categoría e imágenes
      const inventario = await this.prisma.inventario.findMany({
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
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        Nombre,
        descripcion,
        stock = 0,
        estado, // enum EEstado
        idCategoria, // enum ECategoria
        idUsuario = 1, // <- quién realiza la acción (requerido para historial)
        historialDescripcion = "Se agrega ", // opcional
      } = req.body;

      if (typeof idUsuario !== "number") {
        return res
          .status(400)
          .json({
            message: "idUsuario (number) es requerido para generar historial",
          });
      }

      const result = await this.prisma.$transaction(async (tx) => {
        const nuevo = await tx.inventario.create({
          data: { Nombre, descripcion, stock, estado, idCategoria },
        });

        // Si hay stock inicial, registramos un ADD
        if (stock > 0) {
          await tx.historialInventario.create({
            data: {
              idInventario: nuevo.id,
              idUsuario,
              tipoMovimiento: EMovimientoInventario.ADD,
              descripcion:
                `${historialDescripcion} (${nuevo.Nombre}) (+${stock})`,
            },
          });
        } else {
          // Si quieres dejar constancia aún con 0, descomenta:
          await tx.historialInventario.create({
            data: {
              idInventario: nuevo.id,
              idUsuario,
              tipoMovimiento: EMovimientoInventario.ADD,
              descripcion:
                historialDescripcion ??
                `Creación de inventario (stock inicial 0)`,
            },
          });
        }

        return nuevo;
      });

      res.status(201).json(result);
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
