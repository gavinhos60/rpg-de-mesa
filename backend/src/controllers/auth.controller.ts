import { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  getAuthenticatedUser,
} from "../services/auth.service";

export async function registerController(
  req: Request,
  res: Response
) {
  try {
    const user = await registerUser({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);

    if (
      error instanceof Error &&
      error.message === "EMAIL_ALREADY_EXISTS"
    ) {
      res.status(409).json({
        error: "Email já cadastrado",
      });

      return;
    }

    res.status(500).json({
      error: "Erro ao cadastrar usuário",
    });
  }
}

export async function loginController(
  req: Request,
  res: Response
) {
  try {
    const result = await loginUser({
      email: req.body.email,
      password: req.body.password,
    });

    res.json(result);
  } catch (error) {
    console.error(error);

    if (
      error instanceof Error &&
      error.message === "INVALID_CREDENTIALS"
    ) {
      res.status(401).json({
        error: "Email ou senha inválidos",
      });

      return;
    }

    res.status(500).json({
      error: "Erro ao realizar login",
    });
  }
}
export async function meController(
  req: Request,
  res: Response
) {
  try {
    if (!req.user) {
      res.status(401).json({
        error: "Usuário não autenticado",
      });

      return;
    }

    const user = await getAuthenticatedUser(req.user.userId);

    if (!user) {
      res.status(404).json({
        error: "Usuário não encontrado",
      });

      return;
    }

    res.json(user);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Erro ao buscar usuário autenticado",
    });
  }
}