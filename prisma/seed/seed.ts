const { PrismaClient, Role } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

const hashedPassword = bcrypt.hashSync(
  process.env.ADMIN_PASSWORD,
  +process.env.SALT_ROUNDS
);

const userData = {
  email: process.env.ADMIN_EMAIL,
  password: hashedPassword,
  peran: Role.ADMIN,
  nama: "Admin",
};

async function seed() {
  try {
    const user = await prisma.user.create({
      data: userData,
    });

    if (user) console.log("Admin berhasil dibuat");
  } catch (error) {
    console.error("Admin gagal dibuat:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
