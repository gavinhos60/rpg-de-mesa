import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET não configurado");
}

const AUTH_JWT_SECRET: string = JWT_SECRET;

interface JwtPayload {
  userId: number;
  email: string;
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      res.status(401).json({
        error: "Token não informado",
      });

      return;
    }

    const [type, token] = authorization.split(" ");

    if (type !== "Bearer" || !token) {
      res.status(401).json({
        error: "Formato do token inválido",
      });

      return;
    }

    const decoded = jwt.verify(token, AUTH_JWT_SECRET) as JwtPayload;

    req.user = decoded;

    next();
  } catch (error) {
    console.error(error);

    res.status(401).json({
      error: "Token inválido ou expirado",
    });
  }
}