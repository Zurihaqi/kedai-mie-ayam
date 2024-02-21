import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id)
    return NextResponse.json({ error: "Masukan id kedai" }, { status: 400 });

  try {
    const ulasan = await prisma.ulasan.findMany({
      where: {
        idKedai: +id,
      },
      include: {
        penulis: {
          select: {
            id: true,
            nama: true,
            fotoProfil: true,
          },
        },
      },
    });

    let averageRating = 0;

    if (ulasan.length > 0) {
      const totalRating = ulasan.reduce((acc, cur) => acc + cur.rating, 0);
      averageRating = totalRating / ulasan.length;
    }

    const response = {
      ulasan: ulasan,
      averageRating: averageRating.toFixed(1),
    };

    return NextResponse.json({ ulasan: response }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Anda belum login!" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { komentar, rating, idKedai } = body;
    const idPenulis = session.user?.id;

    if (rating > 5 || rating < 0)
      throw new Error("Masukan angka rating yang valid.");

    const kedai = await prisma.kedai.findUnique({
      where: {
        id: +idKedai,
      },
    });

    if (kedai.idPemilik === +idPenulis) {
      throw new Error("Tidak dapat mengulas kedai sendiri :(");
    }

    const duplicateUlasan = await prisma.ulasan.findFirst({
      where: {
        idPenulis: +idPenulis,
        idKedai: idKedai,
      },
    });

    if (duplicateUlasan)
      throw new Error("Anda sudah memberi ulasan untuk kedai ini");

    const createUlasan = await prisma.ulasan.create({
      data: {
        idPenulis: +idPenulis,
        idKedai: +idKedai,
        komentar: komentar,
        rating: +rating,
      },
    });

    if (createUlasan) {
      return NextResponse.json(
        { success: "Berhasil membuat ulasan." },
        { status: 200 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Anda belum login!" }, { status: 401 });
  }

  try {
    const deleteUlasan = await prisma.ulasan.delete({
      where: { id: +id, idPenulis: +session.user.id },
    });

    if (!deleteUlasan) throw new Error("Gagal menghapus ulasan.");

    return NextResponse.json(
      { success: "Berhasil menghapus ulasan!" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
