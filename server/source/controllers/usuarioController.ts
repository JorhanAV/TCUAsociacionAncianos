import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/custom.error";
import { PrismaClient, ERol, Usuario } from "../../generated/prisma";
import bcrypt from "bcryptjs";
import passport from "passport";
import { generateToken } from "../config/authUtils";

export class UsuarioController {
  prisma = new PrismaClient();

  get = async (request: Request, response: Response, next: NextFunction) => {
    try {
      //Obtener todas las resenas incluyendo el usuario,
      const usuario = await this.prisma.usuario.findMany({});
      response.json(usuario);
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
      let idUsuario = parseInt(request.params.id);
      const usuario = await this.prisma.usuario.findUnique({
        where: { id: idUsuario },
        select: {
          id: true,
          nombre_usuario: true,
          correo: true,
          contrasenia: false, // No devolver la contraseña
          rol: true,
        },
      });
      response.json(usuario);
    } catch (error: any) {
      next(error);
    }
  };
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { nombre_usuario, correo, contrasenia, rol } = req.body;

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(contrasenia, salt);

      const user = await this.prisma.usuario.create({
        data: {
          nombre_usuario,
          correo,
          contrasenia: hash,
          rol: rol as ERol,
        },
      });

      res.status(201).json({
        success: true,
        message: "Usuario creado",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  login = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "local",
      { session: false },
      async (
        err: Error | null,
        user: Express.User | false | null,
        info: { message?: string }
      ) => {
        if (err) return next(err);
        if (!user) {
          return res
            .status(401)
            .json({ success: false, message: info.message });
        }
        const token = generateToken(user as Usuario);

        await this.prisma.usuario.update({
          where: { id: (user as Usuario).id },
          data: { ultimo_inicio_sesion: new Date() },
        });

        return res.json({
          success: true,
          message: "Inicio de sesión exitoso",
          token,
        });
      }
    )(req, res, next);
  };
  userAuth = (req: Request, res: Response, next: NextFunction) => {
    try {
      const usuario = req.user as Usuario;
      res.json(usuario);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idUsuario = parseInt(req.params.id);
      const { nombre_usuario, correo, rol } = req.body;

      const usuarioExistente = await this.prisma.usuario.findUnique({
        where: { id: idUsuario },
      });

      const usuarioActualizado = await this.prisma.usuario.update({
        where: { id: idUsuario },
        data: {
          nombre_usuario,
          correo,
          rol,
        },
        select: {
          id: true,
          nombre_usuario: true,
          correo: true,
          rol: true,
        },
      });

      res.json({
        success: true,
        message: "Perfil actualizado",
        data: usuarioActualizado,
      });
    } catch (error) {
      next(error);
    }
  };

  cambiarContrasena = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const idUsuario = parseInt(req.params.id);
      const { actual, nueva } = req.body;

      const usuario = await this.prisma.usuario.findUnique({
        where: { id: idUsuario },
      });

      if (!usuario) {
        res
          .status(404)
          .json({ success: false, message: "Usuario no encontrado" });
        return;
      }

      const esValida = await bcrypt.compare(actual, usuario.contrasenia);
      if (!esValida) {
        res
          .status(400)
          .json({ success: false, message: "Contraseña actual incorrecta" });
        return;
      }

      const nuevaHash = await bcrypt.hash(nueva, 10);

      await this.prisma.usuario.update({
        where: { id: idUsuario },
        data: { contrasenia: nuevaHash },
      });

      res.json({
        success: true,
        message: "Contraseña actualizada correctamente",
      });
    } catch (error) {
      next(error);
    }
  };

  verificarCorreo = async (req: Request, res: Response) => {
    const { correo } = req.query;
    const existe = await this.prisma.usuario.findUnique({
      where: { correo: String(correo) },
    });
    res.json(!!existe);
  };

  verificarCorreoUpdate = async (req: Request, res: Response) => {
    const { correo } = req.query;
    const usuario = await this.prisma.usuario.findUnique({
      where: { correo: String(correo) },
      select: { id: true },
    });

    res.json(usuario ? usuario.id : null);
  };
}
