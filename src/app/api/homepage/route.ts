import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const popularKedai = await prisma.kedai.findMany({
      take: 3,
      orderBy: {
        ulasan: {
          _count: "desc",
        },
      },
      include: {
        ulasan: {
          select: { rating: true },
        },
      },
    });

    const kedaiWithAvgRating = popularKedai.map((k) => {
      const totalRating = k.ulasan.reduce((acc, cur) => acc + cur.rating, 0);
      const averageRating =
        k.ulasan.length > 0 ? totalRating / k.ulasan.length : 0;
      return { ...k, averageRating };
    });

    const latestUlasan = await prisma.ulasan.findMany({
      take: 5,
      orderBy: { dibuatPada: "desc" },
      include: {
        penulis: { select: { id: true, nama: true, fotoProfil: true } },
      },
    });

    if (!popularKedai || !latestUlasan)
      throw new Error("Gagal mengambil data kedai atau ulasan");

    return NextResponse.json(
      { kedai: kedaiWithAvgRating, ulasan: latestUlasan },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
