import { Request, Response } from "express";
import {
  getUsers,
  createUser,
} from "../services/users.service";

export async function listUsers(
  req: Request,
  res: Response
) {
  try {
    const users = await getUsers();

    res.json(users);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Erro ao buscar usuários",
    });
  }
}

export async function createUserController(
  req: Request,
  res: Response
) {
  try {
    const user = await createUser({
      name: req.body.name,
      email: req.body.email,
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Erro ao criar usuário",
    });
  }
}