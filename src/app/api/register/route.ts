import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z, ZodError, ZodIssue } from "zod";
import bcrypt from "bcrypt";

const validateUserBody = z.object({
  email: z.string().email({ message: "Masukan alamat email yang valid." }),
  nama: z
    .string()
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Nama tidak dapat mengandung angka atau simbol.",
    })
    .max(36, { message: "Nama maksimal 32 huruf." }),
  password: z.string().min(8, { message: "Kata sandi minimal 8 karakter." }),
});

const formatZodIssue = (issue: ZodIssue): string => {
  const { path, message } = issue;

  return message;
};

const formatZodError = (error: ZodError): string => {
  const { issues } = error;

  if (issues.length) {
    const currentIssue = issues[0];

    return formatZodIssue(currentIssue);
  }
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    validateUserBody.parse(body);

    const { email, nama, password } = body;
    const defaultPfp = "/default_pfp.png";
    const capitalizedName = nama.replace(
      /(\b[a-z](?!\s))/g,
      function (x: string) {
        return x.toUpperCase();
      }
    );

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error("Email tersebut sudah terdaftar.");
    }

    const hashedPassword = bcrypt.hashSync(password, +process.env.SALT_ROUNDS);

    const newUser = await prisma.user.create({
      data: {
        nama: capitalizedName,
        email,
        password: hashedPassword,
        fotoProfil: defaultPfp,
      },
    });

    if (newUser) {
      return NextResponse.json(
        { success: "Berhasil mendaftar." },
        { status: 200 }
      );
    }
  } catch (error: any) {
    const errorMessage =
      error instanceof ZodError ? formatZodError(error) : error.message;

    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
