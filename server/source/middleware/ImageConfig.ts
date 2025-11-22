import { Request, Response, NextFunction } from "express";
import multer, { StorageEngine } from "multer";
import path from "path";

const maxSize: number = 2 * 1024 * 1024;
const __basedir = path.resolve();

const storage: StorageEngine = multer.diskStorage({
  destination: (request: Request, file: Express.Multer.File, cb) => {
    cb(null, path.join(__basedir, "/assets/uploads/"));
  },
  filename: (request: Request, file: Express.Multer.File, cb) => {
    // SOLAMENTE GENERAR NOMBRE DE ARCHIVO
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1e6);
    cb(
      null,
      "perfil_" + timestamp + "-" + random + path.extname(file.originalname)
    );
  },
});

// Asegúrate de que el nombre del campo coincida con el frontend (FormData.append('files',...))
const uploadFiles = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).array("files"); // Usar .array('files') o .single('files')

export default uploadFiles;
