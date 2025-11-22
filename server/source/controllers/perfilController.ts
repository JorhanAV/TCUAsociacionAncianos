import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/custom.error";
import { PrismaClient, ERol, EEstado } from "../../generated/prisma";
// 🔹 IMPORTANTE: Importamos el middleware de subida
import uploadFiles from "../middleware/ImageConfig";
import path from "path"; // Importar path
import fs from "fs"; // Importar fs

const __basedir = path.resolve();
const directoryPath = path.join(__basedir, "/assets/uploads/");

export class PerfilesController {
  prisma = new PrismaClient(); // GET /perfiles (Ya incluye fotoURL)
  private eliminarArchivo(fileName: string | null) {
    if (!fileName) return;

    const rutaArchivo = path.join(directoryPath, fileName);
    if (fs.existsSync(rutaArchivo)) {
      try {
        fs.unlinkSync(rutaArchivo);
        console.log(`Foto anterior eliminada: ${fileName}`);
      } catch (err) {
        console.error(`Error al eliminar la foto ${fileName}:`, err);
      }
    }
  }
  get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const perfiles = await this.prisma.perfiles.findMany({
        select: {
          id: true,
          nombre: true,
          fechaNacimiento: true,
          cedula: true,
          rol: true,
          fotoURL: true, // ✔️ Correcto: Se retorna la URL de la foto
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
  }; // GET /perfiles/:id (Ya incluye fotoURL)

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
          fotoURL: true, // ✔️ Correcto: Se retorna la URL de la foto
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
  }; // POST /perfiles (Integrando la subida de foto)

  create = (req: Request, res: Response, next: NextFunction) => {
    // 🔹 Envolvemos la lógica dentro del middleware de subida
    uploadFiles(req, res, async (err: any) => {
      let archivoTemporal: string | null = null;
      try {
        // 1. Manejo de error de subida de archivo
        if (err) {
          console.error("Error al subir imagen:", err);
          return res
            .status(500)
            .json({ message: "Error al subir la imagen durante la creación." });
        }

        const archivosSubidos = req.files as Express.Multer.File[] | undefined; // 2. Desestructuramos el cuerpo del request (ya procesado por Multer)
        const {
          nombre,
          fechaNacimiento,
          cedula,
          rol,
          telefonoContacto,
          numeroCelular,
          direccion,
          estado,
        } = req.body; // 3. Validaciones existentes

        if (!nombre || !fechaNacimiento || !cedula || !rol) {
          return res.status(400).json({
            message:
              "Faltan campos requeridos: nombre, fechaNacimiento, cedula, rol",
          });
        }

        if (!Object.values(ERol).includes(rol)) {
          return res.status(400).json({
            message: `Rol inválido. Usa uno de: ${Object.values(ERol).join(
              ", "
            )}`,
          });
        }

        if (estado && !Object.values(EEstado).includes(estado)) {
          return res.status(400).json({
            message: `Estado inválido. Usa uno de: ${Object.values(
              EEstado
            ).join(", ")}`,
          });
        }

        // 4. Determinamos el nombre del archivo subido

        archivoTemporal =
          archivosSubidos && archivosSubidos.length > 0
            ? archivosSubidos[0].filename
            : null;
        const nuevo = await this.prisma.perfiles.create({
          data: {
            nombre,
            fechaNacimiento: new Date(fechaNacimiento),
            cedula,
            rol,
            fotoURL: archivoTemporal, // Usamos el nombre del archivo subido
            telefonoContacto: telefonoContacto ?? null,
            numeroCelular: numeroCelular ?? null,
            direccion: direccion ?? null,
            estado: estado ?? EEstado.ACTIVO,
          },
        });

        res.status(201).json(nuevo);
      } catch (error: any) {
        // Si falla la inserción en BD, borramos el archivo que Multer ya guardó
        this.eliminarArchivo(archivoTemporal);

        if (error?.code === "P2002") {
          return res.status(409).json({ message: "La cédula ya existe" });
        }
        next(error);
      }
    });
  }; // PUT /perfiles/:id (Se mantiene, solo puede actualizar fotoURL si se envía)

  update = (req: Request, res: Response, next: NextFunction) => {
    uploadFiles(req, res, async (err: any) => {
      let archivoTemporal: string | null = null;
      try {
        const id = parseInt(req.params.id);
        if (Number.isNaN(id)) {
          // Si el ID es inválido, borramos el archivo subido antes de fallar
          const archivosSubidos = req.files as
            | Express.Multer.File[]
            | undefined;
          if (archivosSubidos && archivosSubidos.length > 0) {
            this.eliminarArchivo(archivosSubidos[0].filename);
          }
          return res.status(400).json({ message: "ID inválido" });
        }

        if (err) {
          console.error("Error al subir imagen:", err);
          return res
            .status(500)
            .json({
              message: "Error al subir la imagen durante la actualización.",
            });
        }

        const archivosSubidos = req.files as Express.Multer.File[] | undefined;
        const {
          nombre,
          fechaNacimiento,
          cedula,
          rol,
          fotoURL,
          telefonoContacto,
          numeroCelular,
          direccion,
          estado,
        } = req.body; // 1. Manejo de la foto

        let nuevoFotoURL: string | undefined;

        if (archivosSubidos && archivosSubidos.length > 0) {
          // Hay un nuevo archivo subido
          archivoTemporal = archivosSubidos[0].filename; // a. Buscar la URL anterior en la BD

          const perfilActual = await this.prisma.perfiles.findUnique({
            where: { id },
            select: { fotoURL: true },
          }); // b. Borrar la foto anterior

          this.eliminarArchivo(perfilActual?.fotoURL ?? null); // c. Asignar la nueva URL

          nuevoFotoURL = archivoTemporal;
        } else if (fotoURL === null) {
          // Si el frontend manda fotoURL: null (ej. el usuario quiere borrar la foto)
          const perfilActual = await this.prisma.perfiles.findUnique({
            where: { id },
            select: { fotoURL: true },
          });
          this.eliminarArchivo(perfilActual?.fotoURL ?? null);
          nuevoFotoURL = null as any;
        } // 2. Validaciones de Rol/Estado (mantener) // 3. Actualización del registro
        const actualizado = await this.prisma.perfiles.update({
          where: { id },
          data: {
            ...(nombre !== undefined ? { nombre } : {}),
            ...(fechaNacimiento !== undefined
              ? { fechaNacimiento: new Date(fechaNacimiento) }
              : {}),
            ...(cedula !== undefined ? { cedula } : {}),
            ...(rol !== undefined ? { rol } : {}),
            ...(nuevoFotoURL !== undefined ? { fotoURL: nuevoFotoURL } : {}), // 🔹 Aplicamos la nueva URL
            ...(telefonoContacto !== undefined ? { telefonoContacto } : {}),
            ...(numeroCelular !== undefined ? { numeroCelular } : {}),
            ...(direccion !== undefined ? { direccion } : {}),
            ...(estado !== undefined ? { estado } : {}),
          },
        });

        res.json(actualizado);
      } catch (error: any) {
        // Si falla la actualización en BD, borramos el archivo que Multer ya guardó
        this.eliminarArchivo(archivoTemporal);

        if (error?.code === "P2002") {
          return res.status(409).json({ message: "La cédula ya existe" });
        }
        next(error);
      }
    });
  };

  // PATCH /perfiles/:id/estado  { estado: "ACTIVO" | "INACTIVO" }

  setEstado = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const { estado } = req.body;
      if (!estado || !Object.values(EEstado).includes(estado)) {
        return res.status(400).json({
          message: `Estado inválido. Usa uno de: ${Object.values(EEstado).join(
            ", "
          )}`,
        });
      }

      const actualizado = await this.prisma.perfiles.update({
        where: { id },
        data: { estado },
      });

      res.json(actualizado);
    } catch (error) {
      next(error);
    }
  }; // DELETE /perfiles/:id  (hard delete)

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
        return res.status(409).json({
          message:
            "No se puede eliminar: el perfil tiene relaciones (actividades/actas).",
        });
      }
      next(error);
    }
  }; // --------------------------- // Rutas simples para actividades // --------------------------- // GET /perfiles/:id/actividades

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
  }; // POST /perfiles/:id/actividades { idActividad }

  vincularActividad = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const idPerfil = parseInt(req.params.id);
      const idActividad = parseInt(String(req.body.idActividad));

      if (Number.isNaN(idPerfil) || Number.isNaN(idActividad)) {
        return res.status(400).json({ message: "Datos inválidos" });
      } // Validaciones mínimas (existencia)

      const [perfil, actividad] = await Promise.all([
        this.prisma.perfiles.findUnique({ where: { id: idPerfil } }),
        this.prisma.actividad.findUnique({ where: { id: idActividad } }),
      ]);

      if (!perfil)
        return res.status(404).json({ message: "Perfil no encontrado" });
      if (!actividad)
        return res.status(404).json({ message: "Actividad no encontrada" });

      const vinculo = await this.prisma.actividadPerfil.create({
        data: { idPerfil, idActividad },
      });

      res.status(201).json(vinculo);
    } catch (error: any) {
      if (error?.code === "P2002") {
        return res
          .status(409)
          .json({ message: "La actividad ya está vinculada a este perfil" });
      }
      next(error);
    }
  }; // DELETE /perfiles/:id/actividades/:idActividad

  desvincularActividad = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const idPerfil = parseInt(req.params.id);
      const idActividad = parseInt(req.params.idActividad);

      if (Number.isNaN(idPerfil) || Number.isNaN(idActividad)) {
        return res.status(400).json({ message: "Datos inválidos" });
      }

      await this.prisma.actividadPerfil.deleteMany({
        where: { idPerfil, idActividad },
      });
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
