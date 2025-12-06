// controllers/ActasController.ts
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../../generated/prisma";
import uploadActa from "../middleware/ActasUpload";
import fs from "fs";
import path from "path";

const __basedir = path.resolve();
const directoryPath = path.join(__basedir, "/assets/uploads/actas/");

export class ActasController {
  prisma = new PrismaClient();

  // ----------------------------------------
  // 🔹 Utilidad: Eliminar archivo físico
  // ----------------------------------------
  private eliminarArchivo(fileName: string | null) {
    if (!fileName) return;

    const rutaArchivo = path.join(directoryPath, fileName);
    if (fs.existsSync(rutaArchivo)) {
      try {
        fs.unlinkSync(rutaArchivo);
        console.log(`Acta eliminada: ${fileName}`);
      } catch (err) {
        console.error(`Error al eliminar archivo (${fileName}):`, err);
      }
    }
  }

  // ----------------------------------------
  // GET /actas
  // ----------------------------------------
  get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const actas = await this.prisma.actas.findMany({
        orderBy: { id: "desc" },
      });

      res.json(actas);
    } catch (error) {
      next(error);
    }
  };

  // ----------------------------------------
  // GET /actas/:id
  // ----------------------------------------
  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const acta = await this.prisma.actas.findUnique({ where: { id } });
      if (!acta) {
        return res.status(404).json({ message: "Acta no encontrada" });
      }

      res.json(acta);
    } catch (error) {
      next(error);
    }
  };

  // ----------------------------------------
  // POST /actas (crear acta con archivo)
  // ----------------------------------------
  create = (req: Request, res: Response, next: NextFunction) => {
    uploadActa(req, res, async (err: any) => {
      let archivoTemporal: string | null = null;

      try {
        if (err) {
          console.error("Error al subir archivo de acta:", err);
          return res.status(500).json({
            message: "Error al subir el archivo del acta.",
          });
        }

        const archivo = req.file;
        const { idUsuario } = req.body;

        if (!archivo) {
          return res.status(400).json({
            message: "Debes subir un archivo (PDF, DOCX, etc.)",
          });
        }

        if (!idUsuario) {
          this.eliminarArchivo(archivo.filename);
          return res.status(400).json({ message: "idUsuario es requerido" });
        }

        archivoTemporal = archivo.filename;

        const nuevo = await this.prisma.actas.create({
          data: {
            URL: archivoTemporal,
            idUsuario: Number(idUsuario),
          },
        });

        res.status(201).json(nuevo);
      } catch (error) {
        // si falla: borrar archivo subido
        this.eliminarArchivo(archivoTemporal);
        next(error);
      }
    });
  };

  // ----------------------------------------
  // DELETE /actas/:id
  // ----------------------------------------
  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      // Obtener el acta para borrar el archivo físico
      const acta = await this.prisma.actas.findUnique({
        where: { id },
        select: { URL: true },
      });

      if (!acta) {
        return res.status(404).json({ message: "Acta no encontrada" });
      }

      // Borrar archivo físico
      this.eliminarArchivo(acta.URL);

      // Eliminar registro BD
      await this.prisma.actas.delete({ where: { id } });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
