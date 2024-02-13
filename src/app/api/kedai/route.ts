import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z, ZodError, ZodIssue } from "zod";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");

  try {
    if (id) {
      const kedai = await prisma.kedai.findUnique({
        where: { id: +id },
        include: {
          menu: {
            select: { makanan: true, harga: true },
          },
          jadwal: { select: { hari: true, jamBuka: true, jamTutup: true } },
          pemilik: {
            select: { fotoProfil: true, nama: true },
          },
          ulasan: {
            select: { komentar: true, rating: true },
          },
        },
      });

      if (!kedai) throw new Error("Kedai tidak ditemukan!");

      return NextResponse.json({ kedai }, { status: 200 });
    }

    const kedai = await prisma.kedai.findMany({
      include: {
        menu: {
          select: { makanan: true, harga: true },
        },
        jadwal: { select: { hari: true, jamBuka: true, jamTutup: true } },
        pemilik: {
          select: { fotoProfil: true, nama: true },
        },
        ulasan: {
          select: { komentar: true, rating: true },
        },
      },
    });

    if (kedai) return NextResponse.json({ kedai }, { status: 200 });
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
    const formData = await req.formData();

    // Kedai
    const namaKedai = formData.get("namaKedai") as string;
    const kontak = formData.get("kontak") as string;
    const deskripsi = formData.get("deskripsi") as string;
    const alamat = formData.get("alamat") as string;
    const fasilitas = formData.get("fasilitas") as string;
    const gambar = formData.get("gambar") as File;
    let publicId: string;

    // Jadwal
    const hari = formData.get("hari") as string;
    const jamBuka = formData.get("jamBuka") as string;
    const jamTutup = formData.get("jamTutup") as string;

    // Menu
    const makanan = formData.get("makanan") as string;
    const harga = formData.get("harga") as string;

    let uploadedImage: any;

    const capitalizedName = namaKedai.replace(
      /(\b[a-z](?!\s))/g,
      function (x: string) {
        return x.toUpperCase();
      }
    );

    if (gambar) {
      const fileBuffer = await gambar.arrayBuffer();
      const fileStream = Buffer.from(fileBuffer);

      uploadedImage = await new Promise<string>((resolve, reject) => {
        cloudinary.v2.uploader
          .upload_stream(
            {
              resource_type: "image",
              folder: "kedai-mie-ayam/kedai/",
              allowed_formats: ["webp", "png", "jpg", "jpeg"],
              transformation: "product_images",
            },
            (error, result) => {
              if (error) {
                console.error("Error uploading to Cloudinary:", error);
                reject(error);
              }
              publicId = result.public_id;
              resolve(result.secure_url);
            }
          )
          .end(fileStream);
      });

      if (!uploadedImage) {
        throw new Error("Gagal mengunggah gambar.");
      }
    }

    const kedaiData = {
      namaKedai: capitalizedName,
      idPemilik: +session.user?.id,
      kontak,
      deskripsi,
      alamat,
      fasilitas,
      gambar: uploadedImage as string,
      gambarPublicId: publicId,
    };

    // validateBody.parse(kedaiData);

    const createKedai = await prisma.kedai.create({
      data: kedaiData,
    });

    if (createKedai) {
      const jadwalData = {
        idKedai: createKedai.id,
        hari,
        jamBuka,
        jamTutup,
      };

      const menuData = {
        idKedai: createKedai.id,
        makanan,
        harga,
      };

      const [createMenu, createJadwal] = await Promise.all([
        prisma.menu.create({ data: menuData }),
        prisma.jadwal.create({ data: jadwalData }),
      ]);

      if (!createMenu || !createJadwal) {
        throw new Error("Gagal membuat menu atau jadwal.");
      }
    }
    return NextResponse.json(
      { success: "Berhasil membuat kedai baru." },
      { status: 200 }
    );
  } catch (error: any) {
    const errorMessage =
      error instanceof ZodError ? formatZodError(error) : error.message;

    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

function updateDataIfDefined(
  dataObject: { [key: string]: any },
  newData: { [key: string]: any }
) {
  for (const [key, value] of Object.entries(newData)) {
    if (value !== undefined) {
      dataObject[key] = value;
    }
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
