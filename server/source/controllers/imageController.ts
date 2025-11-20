import { NextFunction, Request, Response } from "express";
import fs from "fs";
import path from "path";
import { PrismaClient } from "../../generated/prisma";
import uploadFiles from "../middleware/ImageConfig";

const __basedir = path.resolve();
const baseUrl = "http://localhost:3000/";
const directoryPath = path.join(__basedir, "/assets/uploads/");
export class ImageController {
  prisma = new PrismaClient();

  upload = (request: Request, response: Response, next: NextFunction) => {
    uploadFiles(request, response, (err: any) => {
      if (err) {
        console.error("Error al subir imagen:", err);
        return response.status(500).send({ message: "Error al subir imagen." });
      }

      const files = request.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        return response
          .status(400)
          .send({ message: "¡Por favor sube al menos una imagen!" });
      }

      const fileInfos = files.map((file) => ({
        message: "Archivo subido exitosamente",
        fileName: file.filename,
      }));

      response.status(200).send(fileInfos);
    });
  };

  getListFiles = (
    request: Request,
    response: Response,
    next: NextFunction
  ): void => {
    try {
      fs.readdir(directoryPath, (err, files) => {
        if (err) {
          response.status(500).send({
            message: "¡No se pueden escanear los archivos!",
          });
          return;
        }
        const fileInfos = files.map((file) => ({
          name: file,
          url: baseUrl + file,
        }));
        response.status(200).send(fileInfos);
      });
    } catch (error: any) {
      next(error);
    }
  };

  download = (
    request: Request,
    response: Response,
    next: NextFunction
  ): void => {
    try {
      const fileName = request.params.name;
      const directoryPath = path.join(__basedir, "/assets/uploads//");
      response.download(path.join(directoryPath, fileName), fileName, (err) => {
        if (err) {
          response.status(500).send({
            message: "No se pudo descargar el archivo. " + err,
          });
        }
      });
    } catch (error: any) {
      next(error);
    }
  };
 updatePerfilFoto = (request: Request, response: Response, next: NextFunction) => {
    uploadFiles(request, response, async (err: any) => {
      try {
        if (err) {
          console.error("Error al subir imagen de perfil:", err);
          return response.status(500).send({ message: "Error al subir imagen de perfil." });
        }

        const perfilId = Number(request.params.id);
        const archivosSubidos = request.files as Express.Multer.File[];

        if (!perfilId || isNaN(perfilId)) {
          return response.status(400).json({ message: "ID de perfil inválido." });
        }

        if (!archivosSubidos || archivosSubidos.length === 0) {
          return response
            .status(400)
            .json({ message: "Debes subir al menos una imagen." });
        }

        // solo usamos la primera imagen
        const nuevoArchivo = archivosSubidos[0];

        // 🔹 Opcional: si NO quieres depender de previousFileName,
        // puedes limpiar la foto anterior desde la BD:
        const perfilActual = await this.prisma.perfiles.findUnique({
          where: { id: perfilId },
          select: { fotoURL: true },
        });

        if (perfilActual?.fotoURL) {
          const rutaAnterior = path.join(directoryPath, perfilActual.fotoURL);
          if (fs.existsSync(rutaAnterior)) {
            fs.unlinkSync(rutaAnterior);
            console.log(`Foto anterior eliminada: ${perfilActual.fotoURL}`);
          }
        }

        // 🔹 Actualizar la columna fotoURL del perfil
        const perfilActualizado = await this.prisma.perfiles.update({
          where: { id: perfilId },
          data: { fotoURL: nuevoArchivo.filename },
        });

        return response.status(200).json({
          message: "Foto de perfil actualizada correctamente.",
          fileName: nuevoArchivo.filename,
          perfil: perfilActualizado,
        });
      } catch (error) {
        console.error("Error en updatePerfilFoto:", error);
        response
          .status(500)
          .json({ message: "Error al actualizar la foto de perfil." });
      }
    });
  };
}
