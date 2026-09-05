import { prisma } from "../lib/prisma";

export async function getUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      characters: true,
    },
  });
}

export async function createUser(data: {
  name: string;
  email: string;
}) {
  return prisma.user.create({
    data,
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
}