import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/custom.error";
import {
  ECategoria,
  EMovimientoInventario,
  ETipoActividad,
  PrismaClient,
} from "../../generated/prisma";

export class ActividadesController {
  prisma = new PrismaClient();

  get = async (request: Request, response: Response, next: NextFunction) => {
    try {
      // Obtener la fecha actual sin hora (00:00:00)
      const actividades = await this.prisma.actividad.findMany({
        select: {
          id: true,
          nombre: true,
          fechaActividad: true,
          horaInicio: true,
          duracion: true,
          tipoActividad: true,
          createdAt: true,
          updatedAt: true,

          perfiles: {
            select: {
              id: true,
              perfil: {
                select: {
                  id: true,
                  nombre: true,
                  cedula: true,
                  rol: true,
                },
              },
            },
          },

          // 🔥 Inventarios asociados (N:M)
          inventarios: {
            select: {
              id: true,
              cantidadxPersona: true,
              inventario: {
                select: {
                  id: true,
                  Nombre: true,
                  descripcion: true,
                  stock: true,
                  idCategoria: true,
                },
              },
            },
          },
        },
        orderBy: {
          fechaActividad: "asc",
        },
      });

      response.json(actividades);
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
      const idActividad = parseInt(request.params.id);

      const actividad = await this.prisma.actividad.findUnique({
        where: { id: idActividad },
        select: {
          id: true,
          nombre: true,
          fechaActividad: true,
          horaInicio: true,
          duracion: true,
          tipoActividad: true,
          createdAt: true,
          updatedAt: true,

          // 🔥 Perfiles asociados (N:M)
          perfiles: {
            select: {
              id: true,
              perfil: {
                select: {
                  id: true,
                  nombre: true,
                  cedula: true,
                  rol: true,
                },
              },
            },
          },

          // 🔥 Inventarios asociados (N:M)
          inventarios: {
            select: {
              id: true,
              cantidadxPersona: true,
              inventario: {
                select: {
                  id: true,
                  Nombre: true,
                  descripcion: true,
                  stock: true,
                  idCategoria: true,
                },
              },
            },
          },
        },
      });

      response.json(actividad);
    } catch (error: any) {
      next(error);
    }
  };

  //Obtener por Id
  getByTipoActividad = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const raw = (
        request.params.tipoActividad ??
        request.params.id ??
        ""
      ).toString();

      const tipoActividad = raw as ETipoActividad;
      if (!Object.values(ETipoActividad).includes(tipoActividad)) {
        return response.status(400).json({
          message: `Tipo de actividad inválido. Usa uno de: ${Object.values(
            ETipoActividad
          ).join(", ")}`,
        });
      }

      const actividades = await this.prisma.actividad.findMany({
        where: { tipoActividad: tipoActividad },
        select: {
          id: true,
          nombre: true,
          fechaActividad: true,
          horaInicio: true,
          duracion: true,
          tipoActividad: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      response.json(actividades);
    } catch (error: any) {
      next(error);
    }
  };

  //Crear
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        nombre,
        fechaActividad,
        horaInicio,
        duracion,
        tipoActividad,
        idsPerfiles = [],
        inventarios = [], // [{ idInventario, cantidadxPersona }]
      } = req.body;

      if (
        !nombre ||
        !fechaActividad ||
        !horaInicio ||
        !duracion ||
        !tipoActividad
      ) {
        return res.status(400).json({
          message: "Faltan campos obligatorios",
        });
      }

      const actividad = await this.prisma.$transaction(async (tx) => {
        const nueva = await tx.actividad.create({
          data: {
            nombre,
            fechaActividad: new Date(fechaActividad),
            horaInicio: new Date(horaInicio),
            duracion: Number(duracion),
            tipoActividad,
          },
        });

        // --- Perfiles asociados ---
        if (Array.isArray(idsPerfiles) && idsPerfiles.length > 0) {
          for (const idPerfil of idsPerfiles) {
            await tx.actividadPerfil.create({
              data: { idPerfil, idActividad: nueva.id },
            });
          }
        }

        // --- Inventarios asociados (con cantidadxPersona) ---
        if (Array.isArray(inventarios) && inventarios.length > 0) {
          for (const inv of inventarios) {
            await tx.inventarioActividad.create({
              data: {
                idInventario: inv.idInventario,
                idActividad: nueva.id,
                cantidadxPersona: inv.cantidadxPersona,
              },
            });
          }
        }

        return nueva;
      });

      res.status(201).json(actividad);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);

      const {
        nombre,
        fechaActividad,
        horaInicio,
        duracion,
        tipoActividad,
        idsPerfiles,
        inventarios, // [{ idInventario, cantidadxPersona }]
      } = req.body;

      const actividad = await this.prisma.actividad.findUnique({
        where: { id },
      });

      if (!actividad) {
        return res.status(404).json({ message: "Actividad no encontrada" });
      }

      const actualizada = await this.prisma.$transaction(async (tx) => {
        const act = await tx.actividad.update({
          where: { id },
          data: {
            nombre: nombre ?? actividad.nombre,
            fechaActividad: fechaActividad
              ? new Date(fechaActividad)
              : actividad.fechaActividad,
            horaInicio: horaInicio
              ? new Date(horaInicio)
              : actividad.horaInicio,
            duracion: duracion ?? actividad.duracion,
            tipoActividad: tipoActividad ?? actividad.tipoActividad,
          },
        });

        // --- Actualizar Perfiles si llegan ---
        if (Array.isArray(idsPerfiles)) {
          await tx.actividadPerfil.deleteMany({ where: { idActividad: id } });

          for (const idPerfil of idsPerfiles) {
            await tx.actividadPerfil.create({
              data: { idPerfil, idActividad: id },
            });
          }
        }

        // --- Actualizar Inventarios si llegan ---
        if (Array.isArray(inventarios)) {
          await tx.inventarioActividad.deleteMany({
            where: { idActividad: id },
          });

          for (const inv of inventarios) {
            await tx.inventarioActividad.create({
              data: {
                idInventario: inv.idInventario,
                idActividad: id,
                cantidadxPersona: inv.cantidadxPersona,
              },
            });
          }
        }

        return act;
      });

      res.json(actualizada);
    } catch (error) {
      next(error);
    }
  };
}
