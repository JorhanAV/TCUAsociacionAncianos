import express, { Express } from 'express';
import cors from "cors";
import morgan from "morgan";
import * as dotenv from 'dotenv';
import path from 'path';
import { ErrorMiddleware } from './middleware/error.middleware';
import { AppRoutes } from './routes/routes';
import "./config/passport";

const app: Express = express();
dotenv.config();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __basedir = path.resolve();

// ----------------------------------------------------
// 🔹 Archivos estáticos ANTES de cargar las rutas
// ----------------------------------------------------
app.use(
  '/assets/uploads',
  express.static(path.join(__basedir, 'assets', 'uploads'))
);

// ----------------------------------------------------
// 🔹 Registro de rutas
// ----------------------------------------------------
app.use(AppRoutes.routes);

// ----------------------------------------------------
// 🔹 Manejo centralizado de errores
// ----------------------------------------------------
app.use(ErrorMiddleware.handleError);

// ----------------------------------------------------
// 🔹 Iniciar servidor
// ----------------------------------------------------
app.listen(port, () => {
  console.log(`API corriendo en http://localhost:${port}`);
  console.log('Presione CTRL-C para detenerlo\n');
});
