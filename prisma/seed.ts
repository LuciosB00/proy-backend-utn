import { PrismaClient, Role } from "../generated/prisma/client";
import { hashSync } from "bcrypt";

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // verify if admin already exists
  const adminExists = await prisma.user.findFirst({
    where: {
      email: process.env.ADMIN_EMAIL?.toLowerCase(),
      deletedAt: null,
    },
  });
  if (adminExists) {
    console.log(`User with email ${process.env.ADMIN_EMAIL} already exists`);
    return;
  } else {
    await prisma.user.create({
      data: {
        fullName: process.env.ADMIN_FULLNAME!,
        email: process.env.ADMIN_EMAIL!,
        password: hashSync(process.env.ADMIN_PASSWORD!, 10),
        role: Role.ADMIN,
      },
    });
    console.log(`User with email ${process.env.ADMIN_EMAIL} created`);
  }
}

// execute the main function
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
