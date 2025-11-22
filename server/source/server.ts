import express, {Express} from 'express'
import cors from "cors";
import morgan from "morgan";
import * as dotenv from 'dotenv' 
import path from 'path'
import { ErrorMiddleware } from './middleware/error.middleware';
import { AppRoutes } from './routes/routes';
import "./config/passport"  

const rootDir = __dirname;


const app: Express=express()
dotenv.config();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(morgan("dev"));

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
const __basedir = path.resolve();

//---- Registro de rutas ----
app.use(AppRoutes.routes)

//Gestión de errores middleware
app.use(ErrorMiddleware.handleError);

//Acceso a las imágenes
app.use(
  '/assets/uploads', 
  express.static(path.join(__basedir, 'assets', 'uploads'))
);

app.listen(port, () => {
  console.log(`API corriendo en http://localhost:${port}`);
  console.log('Presione CTRL-C para detenerlo\n');
});
