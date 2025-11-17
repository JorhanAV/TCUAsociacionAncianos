import { Request, Response, NextFunction } from 'express';
import multer, { StorageEngine } from 'multer';
import util from 'util';
import path from "path";
import fs from 'fs'; 
import { Prisma } from '../../generated/prisma';

// Definición del tamaño máximo del archivo en bytes
const maxSize: number = 2 * 1024 * 1024;
const __basedir = path.resolve();

// Configuración del almacenamiento con multer
const storage: StorageEngine = multer.diskStorage({
  destination: (request: Request, file: Express.Multer.File, cb ) => {
    cb(null, path.join(__basedir, "/assets/uploads/"));
  },
  filename: (request: Request, file: Express.Multer.File, cb) => {
      const uploadPath = path.join(__basedir, "/assets/uploads/");
    const previousFileName = request.body.previousFileName; 

    // Borrar el archivo anterior si existe
    if (previousFileName && previousFileName!='') {
      const previousFilePath = path.join(uploadPath, previousFileName);
      fs.unlink(previousFilePath, (err) => {
        if (err && err.code !== 'ENOENT') { // 'ENOENT' significa "archivo no encontrado"
          console.error('Error al intentar borrar el archivo anterior:', err);
        } else if (!err) {
          console.log(`Archivo anterior ${previousFileName} borrado exitosamente.`);
        }
      });
    }
    
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1e6);

    // Generar el nombre del nuevo archivo
    cb(null,'perfil_' + timestamp + '-' + random
          + path.extname(file.originalname))
  },
});

// Configuración de multer con el tamaño máximo del archivo
const uploadFiles = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).array('imagenes');

// Convertir el middleware a una promesa
//const ImageConfig = util.promisify(uploadFiles);

export default uploadFiles;