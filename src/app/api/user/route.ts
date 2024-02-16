import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z, ZodError, ZodIssue } from "zod";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");

  try {
    const user = await prisma.user.findUnique({
      where: { id: +id },
      include: {
        kedai: {
          select: {
            id: true,
            namaKedai: true,
            gambar: true,
            ulasan: {
              select: { komentar: true, rating: true },
            },
          },
        },
        ulasan: {
          select: {
            id: true,
            komentar: true,
            rating: true,
            dibuatPada: true,
            kedai: true,
          },
        },
      },
    });

    if (!user) throw new Error("Pengguna tidak ditemukan!");
    const kedaiWithAvgRating = user.kedai.map((k) => {
      const totalRating = k.ulasan.reduce((acc, cur) => acc + cur.rating, 0);
      const averageRating = (
        k.ulasan.length > 0 ? totalRating / k.ulasan.length : 0
      ).toFixed(1);
      return { ...k, averageRating };
    });

    const totalUserRating = user.ulasan.reduce(
      (acc, cur) => acc + cur.rating,
      0
    );
    const averageUserRating = (
      user.ulasan.length > 0 ? totalUserRating / user.ulasan.length : 0
    ).toFixed(1);

    return NextResponse.json(
      { user: { ...user, averageUserRating, kedai: kedaiWithAvgRating } },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Anda belum login!" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const nama = formData.get("nama") as string;
    const email = formData.get("email") as string;
    const bio = formData.get("bio") as string;
    const fotoProfil = formData.get("fotoProfil") as File;
    let capitalizedNama: string;
    let publicId: string;
    let uploadedImage: any;

    if (nama) {
      capitalizedNama = nama.replace(/(\b[a-z](?!\s))/g, function (x: string) {
        return x.toUpperCase();
      });
    }

    const userExist = await prisma.user.findUnique({
      where: { id: +session.user?.id },
    });
    if (!userExist) throw new Error("Pengguna tidak ditemukan.");

    if (email) {
      const userWithEmail = await prisma.user.findFirst({
        where: {
          email: email,
          NOT: {
            id: +session.user?.id,
          },
        },
      });
      if (userWithEmail) {
        throw new Error("Email sudah terdaftar oleh pengguna lain.");
      }
    }

    if (fotoProfil) {
      const fileBuffer = await fotoProfil.arrayBuffer();

      var mime = fotoProfil.type;
      var encoding = "base64";
      var base64Data = Buffer.from(fileBuffer).toString("base64");
      var fileUri = "data:" + mime + ";" + encoding + "," + base64Data;

      if (userExist.profilPublicId) {
        cloudinary.v2.uploader.destroy(userExist.profilPublicId);
      }

      uploadedImage = await new Promise<string>((resolve, reject) => {
        cloudinary.v2.uploader.upload(
          fileUri,
          {
            resource_type: "image",
            folder: "kedai-mie-ayam/avatar/",
            allowed_formats: ["webp", "png", "jpg", "jpeg"],
            transformation: "profile_pic",
          },
          (error, result) => {
            if (error) {
              console.error("Error uploading to Cloudinary:", error);
              reject(error);
            }
            publicId = result.public_id;
            resolve(result.secure_url);
          }
        );
      });

      if (!uploadedImage) {
        throw new Error("Gagal mengunggah gambar.");
      }
    }

    const updateData: { [key: string]: any } = {};
    if (nama) updateData.nama = capitalizedNama;
    if (email) updateData.email = email;
    if (bio) updateData.bio = bio;
    if (uploadedImage) updateData.fotoProfil = uploadedImage;
    if (publicId) updateData.profilPublicId = publicId;

    validateBody.parse(updateData);

    const user = await prisma.user.update({
      where: { id: +session.user?.id },
      data: updateData,
    });

    if (user) {
      return NextResponse.json(
        {
          user: { name: user.nama, email: user.email, image: user.fotoProfil },
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    const errorMessage =
      error instanceof ZodError ? formatZodError(error) : error.message;

    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Anda belum login!" }, { status: 401 });
  }
  if (+session.user?.id !== +id)
    return NextResponse.json(
      { error: "Anda tidak memiliki hak untuk aksi ini." },
      { status: 401 }
    );

  try {
    const userExist = await prisma.user.findUnique({
      where: { id: +session.user?.id },
    });
    if (!userExist) throw new Error("User tidak ditemukan.");

    if (userExist.profilPublicId) {
      cloudinary.v2.uploader.destroy(userExist.profilPublicId);
    }

    const deleteUser = await prisma.user.delete({
      where: { id: +session.user?.id },
    });
    if (deleteUser)
      return NextResponse.json(
        { success: "Berhasil menghapus akun." },
        { status: 200 }
      );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

const validateBody = z.object({
  email: z
    .string()
    .email({ message: "Masukan alamat email yang valid." })
    .optional()
    .nullable(),
  nama: z
    .string()
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Nama tidak dapat mengandung angka atau simbol.",
    })
    .max(36, { message: "Nama maksimal 32 huruf." })
    .optional()
    .nullable(),
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
