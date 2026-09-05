import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";

async function main() {
  const users = [
    {
      email: "guilherme@rpg.local",
      password: "123456",
    },
    {
      email: "gavinhos60@gmail.com",
      password: "123456",
    },
  ];

  for (const user of users) {
    const passwordHash = await bcrypt.hash(
      user.password,
      10
    );

    const updatedUser = await prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        password: passwordHash,
      },
    });

    console.log(
      `Senha definida para: ${updatedUser.email}`
    );
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });