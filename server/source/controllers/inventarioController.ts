import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/custom.error";
import { PrismaClient } from "../../generated/prisma";

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
      response.json();
    } catch (error: any) {
      next(error);
    }
  };
  //Crear
  create = async (request: Request, response: Response, next: NextFunction) => {
    try {
      response.status(201).json();
    } catch (error) {
      next(error);
    }
  };

  update = async (request: Request, response: Response, next: NextFunction) => {
    try {
      response.status(200).json();
    } catch (error: any) {
      next(error);
    }
  };
}
