import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError, ZodIssue } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcrypt";

const validateUserBody = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8, { message: "Kata sandi minimal 8 karakter." }),
});

const formatZodIssue = (issue: ZodIssue): string => {
  const { message } = issue;
  return message;
};

const formatZodError = (error: ZodError): string => {
  const { issues } = error;

  if (issues.length) {
    const currentIssue = issues[0];
    return formatZodIssue(currentIssue);
  }
};

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Anda belum login!" }, { status: 401 });
  }

  try {
    const body = await req.json();

    validateUserBody.parse(body);

    const { currentPassword, newPassword } = body;

    const user = await prisma.user.findUnique({
      where: { id: +session.user.id },
      select: { password: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan." },
        { status: 404 }
      );
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Kata sandi lama salah." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      +process.env.SALT_ROUNDS
    );

    await prisma.user.update({
      where: { id: +session.user.id },
      data: {
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { success: "Kata sandi berhasil diubah." },
      { status: 200 }
    );
  } catch (error: any) {
    const errorMessage =
      error instanceof ZodError ? formatZodError(error) : error.message;

    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
