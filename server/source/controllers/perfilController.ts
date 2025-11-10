import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/custom.error";
import { PrismaClient, ERol, EEstado } from "../../generated/prisma";

export class PerfilesController {
  prisma = new PrismaClient();

  // GET /perfiles
  get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const perfiles = await this.prisma.perfiles.findMany({
        select: {
          id: true,
          nombre: true,
          fechaNacimiento: true,
          cedula: true,
          rol: true,
          fotoURL: true,
          telefonoContacto: true,
          numeroCelular: true,
          direccion: true,
          estado: true,
        },
        orderBy: { id: "desc" },
      });

      res.json(perfiles);
    } catch (error) {
      next(error);
    }
  };

  // GET /perfiles/:id
  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const perfil = await this.prisma.perfiles.findUnique({
        where: { id },
        select: {
          id: true,
          nombre: true,
          fechaNacimiento: true,
          cedula: true,
          rol: true,
          fotoURL: true,
          telefonoContacto: true,
          numeroCelular: true,
          direccion: true,
          estado: true,
        },
      });

      if (!perfil) {
        return res.status(404).json({ message: "Perfil no encontrado" });
      }

      res.json(perfil);
    } catch (error) {
      next(error);
    }
  };

  // POST /perfiles
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        nombre,
        fechaNacimiento, // "YYYY-MM-DD" o ISO
        cedula,
        rol, // ERol
        fotoURL,
        telefonoContacto,
        numeroCelular,
        direccion,
        estado, // EEstado (opcional)
      } = req.body;

      if (!nombre || !fechaNacimiento || !cedula || !rol) {
        return res.status(400).json({
          message: "Faltan campos requeridos: nombre, fechaNacimiento, cedula, rol",
        });
      }

      if (!Object.values(ERol).includes(rol)) {
        return res
          .status(400)
          .json({ message: `Rol inválido. Usa uno de: ${Object.values(ERol).join(", ")}` });
      }

      if (estado && !Object.values(EEstado).includes(estado)) {
        return res
          .status(400)
          .json({ message: `Estado inválido. Usa uno de: ${Object.values(EEstado).join(", ")}` });
      }

      const nuevo = await this.prisma.perfiles.create({
        data: {
          nombre,
          fechaNacimiento: new Date(fechaNacimiento),
          cedula,
          rol,
          fotoURL: fotoURL ?? null,
          telefonoContacto: telefonoContacto ?? null,
          numeroCelular: numeroCelular ?? null,
          direccion: direccion ?? null,
          estado: estado ?? EEstado.ACTIVO,
        },
      });

      res.status(201).json(nuevo);
    } catch (error: any) {
      // Clave única (cedula)
      if (error?.code === "P2002") {
        return res.status(409).json({ message: "La cédula ya existe" });
      }
      next(error);
    }
  };

  // PUT /perfiles/:id
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const {
        nombre,
        fechaNacimiento,
        cedula,
        rol, // ERol
        fotoURL,
        telefonoContacto,
        numeroCelular,
        direccion,
        estado, // EEstado
      } = req.body;

      if (rol && !Object.values(ERol).includes(rol)) {
        return res
          .status(400)
          .json({ message: `Rol inválido. Usa uno de: ${Object.values(ERol).join(", ")}` });
      }

      if (estado && !Object.values(EEstado).includes(estado)) {
        return res
          .status(400)
          .json({ message: `Estado inválido. Usa uno de: ${Object.values(EEstado).join(", ")}` });
      }

      const actualizado = await this.prisma.perfiles.update({
        where: { id },
        data: {
          ...(nombre !== undefined ? { nombre } : {}),
          ...(fechaNacimiento !== undefined ? { fechaNacimiento: new Date(fechaNacimiento) } : {}),
          ...(cedula !== undefined ? { cedula } : {}),
          ...(rol !== undefined ? { rol } : {}),
          ...(fotoURL !== undefined ? { fotoURL } : {}),
          ...(telefonoContacto !== undefined ? { telefonoContacto } : {}),
          ...(numeroCelular !== undefined ? { numeroCelular } : {}),
          ...(direccion !== undefined ? { direccion } : {}),
          ...(estado !== undefined ? { estado } : {}),
        },
      });

      res.json(actualizado);
    } catch (error: any) {
      if (error?.code === "P2002") {
        return res.status(409).json({ message: "La cédula ya existe" });
      }
      next(error);
    }
  };

  // PATCH /perfiles/:id/estado  { estado: "ACTIVO" | "INACTIVO" }
  setEstado = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const { estado } = req.body;
      if (!estado || !Object.values(EEstado).includes(estado)) {
        return res
          .status(400)
          .json({ message: `Estado inválido. Usa uno de: ${Object.values(EEstado).join(", ")}` });
      }

      const actualizado = await this.prisma.perfiles.update({
        where: { id },
        data: { estado },
      });

      res.json(actualizado);
    } catch (error) {
      next(error);
    }
  };

  // DELETE /perfiles/:id  (hard delete)
  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      await this.prisma.perfiles.delete({ where: { id } });
      res.status(204).send();
    } catch (error: any) {
      if (error?.code === "P2003") {
        return res
          .status(409)
          .json({ message: "No se puede eliminar: el perfil tiene relaciones (actividades/actas)." });
      }
      next(error);
    }
  };

  // ---------------------------
  // Rutas simples para actividades
  // ---------------------------

  // GET /perfiles/:id/actividades
  getActividades = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idPerfil = parseInt(req.params.id);
      if (Number.isNaN(idPerfil)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const actividades = await this.prisma.actividadPerfil.findMany({
        where: { idPerfil },
        select: {
          id: true,
          idActividad: true,
          actividad: {
            select: {
              id: true,
              nombre: true,
              fechaActividad: true,
              horaInicio: true,
              duracion: true,
              tipoActividad: true,
            },
          },
        },
        orderBy: { id: "desc" },
      });

      res.json(actividades);
    } catch (error) {
      next(error);
    }
  };

  // POST /perfiles/:id/actividades { idActividad }
  vincularActividad = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idPerfil = parseInt(req.params.id);
      const idActividad = parseInt(String(req.body.idActividad));

      if (Number.isNaN(idPerfil) || Number.isNaN(idActividad)) {
        return res.status(400).json({ message: "Datos inválidos" });
      }

      // Validaciones mínimas (existencia)
      const [perfil, actividad] = await Promise.all([
        this.prisma.perfiles.findUnique({ where: { id: idPerfil } }),
        this.prisma.actividad.findUnique({ where: { id: idActividad } }),
      ]);

      if (!perfil) return res.status(404).json({ message: "Perfil no encontrado" });
      if (!actividad) return res.status(404).json({ message: "Actividad no encontrada" });

      const vinculo = await this.prisma.actividadPerfil.create({
        data: { idPerfil, idActividad },
      });

      res.status(201).json(vinculo);
    } catch (error: any) {
      if (error?.code === "P2002") {
        return res.status(409).json({ message: "La actividad ya está vinculada a este perfil" });
      }
      next(error);
    }
  };

  // DELETE /perfiles/:id/actividades/:idActividad
  desvincularActividad = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idPerfil = parseInt(req.params.id);
      const idActividad = parseInt(req.params.idActividad);

      if (Number.isNaN(idPerfil) || Number.isNaN(idActividad)) {
        return res.status(400).json({ message: "Datos inválidos" });
      }

      await this.prisma.actividadPerfil.deleteMany({ where: { idPerfil, idActividad } });
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
