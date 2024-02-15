import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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
            select: { id: true, fotoProfil: true, nama: true },
          },
          ulasan: {
            select: {
              komentar: true,
              rating: true,
              dibuatPada: true,
            },
          },
        },
      });

      if (!kedai) throw new Error("Kedai tidak ditemukan!");

      return NextResponse.json({ kedai }, { status: 200 });
    }

    const Allkedai = await prisma.kedai.findMany({
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

    const kedai = Allkedai.map((k) => {
      const totalRating = k.ulasan.reduce((acc, cur) => acc + cur.rating, 0);
      const averageRating =
        k.ulasan.length > 0 ? totalRating / k.ulasan.length : 0;
      return { ...k, averageRating };
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
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
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
    let capitalizedName: string;

    if (namaKedai) {
      capitalizedName = namaKedai.replace(
        /(\b[a-z](?!\s))/g,
        function (x: string) {
          return x.toUpperCase();
        }
      );
    }

    const kedaiData: { [key: string]: any } = {
      idPemilik: +session.user?.id,
    };

    if (namaKedai) kedaiData.namaKedai = capitalizedName;
    if (kontak) kedaiData.kontak = kontak;
    if (deskripsi) kedaiData.deskripsi = deskripsi;
    if (alamat) kedaiData.alamat = alamat;
    if (fasilitas) kedaiData.fasilitas = fasilitas;

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

      kedaiData.gambar = uploadedImage as string;
      kedaiData.gambarPublicId = publicId;
    }

    const createKedai = await prisma.kedai.update({
      where: { id: +id },
      data: kedaiData,
      include: {
        menu: {
          select: { id: true },
        },
        jadwal: {
          select: { id: true },
        },
      },
    });

    if (createKedai && (hari || jamBuka || jamTutup)) {
      const jadwalData: { [key: string]: any } = {};

      if (hari) jadwalData.hari = hari;
      if (jamBuka) jadwalData.jamBuka = jadwalData;
      if (jamTutup) jadwalData.jamTutup = jamTutup;

      const menuData: { [key: string]: any } = {};

      if (makanan) menuData.makanan = makanan;
      if (harga) menuData.harga = harga;

      const [createMenu, createJadwal] = await Promise.all([
        prisma.menu.update({
          where: { id: createKedai.menu[0].id },
          data: menuData,
        }),
        prisma.jadwal.update({
          where: { id: createKedai.jadwal[0].id },
          data: jadwalData,
        }),
      ]);

      if (!createMenu || !createJadwal) {
        throw new Error("Gagal mengubah menu atau jadwal.");
      }
    }

    return NextResponse.json(
      { success: "Berhasil mengubah data kedai." },
      { status: 200 }
    );
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
    const kedaiExist = await prisma.kedai.findUnique({
      where: { id: +id, idPemilik: +session.user?.id },
    });
    if (!kedaiExist) throw new Error("Kedai tidak ditemukan!");

    if (kedaiExist.gambarPublicId) {
      cloudinary.v2.uploader.destroy(kedaiExist.gambarPublicId);
    }

    const deleteKedai = await prisma.kedai.delete({
      where: { id: +id, idPemilik: +session.user?.id },
    });
    if (deleteKedai)
      return NextResponse.json(
        { success: "Berhasil menghapus kedai." },
        { status: 200 }
      );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
