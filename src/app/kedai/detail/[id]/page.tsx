"use client";

import * as React from "react";
import PageLayout from "@/components/PageLayout/Layout";
import ReviewSection from "@/components/ReviewSection/ReviewSection";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import Link from "next/link";
import { useSession } from "next-auth/react";

const DetailedInfo = ({
  hari,
  jamBuka,
  jamTutup,
  kontak,
  alamat,
  menu,
  fasilitas,
}) => {
  let fasilitasArray: any;

  if (fasilitas) {
    fasilitasArray = fasilitas.split(",");
  }

  const makananArray = menu.makanan.split(";");
  const hargaArray = menu.harga.split(";");
  const menuArray = [makananArray, hargaArray];

  return (
    <div>
      <p className="font-bold">Jadwal kedai:</p>
      <p>
        {hari} ({jamBuka} - {jamTutup})
      </p>
      <br />
      <p className="font-bold">Kontak:</p>
      <p>
        <FontAwesomeIcon icon={faWhatsapp} /> {kontak}
      </p>
      <br />
      <p className="font-bold">Alamat:</p>
      <p>{alamat}</p>
      <br />
      <p className="font-bold">Fasilitas:</p>
      <div className="flex flex-wrap gap-2">
        {(fasilitasArray &&
          fasilitasArray.map((fasilitasItem: string, index) => (
            <p
              key={index}
              className="border border-sky-500 rounded-xl py-1 w-fit px-2"
            >
              {fasilitasItem}
            </p>
          ))) || <p>Tidak ada</p>}
      </div>
      <br />
      <div className="text-center border-2 bg-neutral-50 border-amber-400 p-2 rounded flex flex-col gap-2">
        <p className="font-bold border-b-2 border-amber-400">Menu</p>
        <div className="grid grid-cols-2 text-center">
          {menuArray[0].map((makanan, index) => (
            <React.Fragment key={index}>
              <p>{makanan}</p>
              <p>{menuArray[1][index]}</p>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function KedaiDetail({ params }: { params: { id: string } }) {
  const [dataKedai, setDataKedai] = React.useState(null);
  const [createdDate, setCreatedDate] = React.useState(null);
  const [averageRating, setAverageRating] = React.useState(null);

  const { data } = useSession();

  React.useEffect(() => {
    const getKedaiData = async () => {
      try {
        const kedai = await fetch(`/api/kedai?id=${params.id}`, {
          method: "GET",
        });

        const res = await kedai.json();
        setCreatedDate(new Date(res.kedai.dibuatPada).toLocaleDateString());

        setAverageRating(calculateAverageRating(res.kedai));

        return setDataKedai(res);
      } catch (error: any) {
        return toast.error(error.message);
      }
    };

    getKedaiData();
  }, []);

  const calculateAverageRating = (kedai) => {
    if (!kedai.ulasan || kedai.ulasan.length === 0) return 0;

    let totalRating = 0;
    kedai.ulasan.forEach((ulasan) => {
      totalRating += ulasan.rating;
    });

    const averageRating = totalRating / kedai.ulasan?.rating?.length;
    return averageRating;
  };

  return (
    <PageLayout>
      {(!dataKedai && (
        <div className="p-12 text-center">
          <Image
            src="/spinner.gif"
            alt="loading"
            width={100}
            height={100}
            style={{ width: "auto", height: "auto" }}
            className="mx-auto"
          />
          <h1 className="text-3xl font-bold">Memuat...</h1>
        </div>
      )) || (
        <div className="flex lg:flex-row flex-col-reverse max-w-[1000px] mx-auto lg:gap-4 gap-2">
          <div className="lg:flex flex-col lg:mt-12 hidden">
            <div className="bg-gray-100 mx-auto p-2 px-4 rounded-lg shadow-md mb-4 lg:w-[300px] w-[350px] max-h-max">
              <p className="font-bold">Diposting oleh:</p>
              <div className="flex flex-wrap hover:underline underline-offset-2 w-fit">
                <Image
                  width={30}
                  height={30}
                  src={
                    dataKedai?.kedai?.pemilik?.fotoProfil || "/default_pfp.png"
                  }
                  alt="author"
                  className="rounded-full my-2 w-full"
                  style={{ width: "auto", height: "auto" }}
                />
                <Link
                  href={`/profile/view/${dataKedai.kedai.idPemilik}`}
                  className="font-bold self-center mx-2"
                >
                  <span>{dataKedai?.kedai?.pemilik?.nama}</span>
                </Link>
              </div>
              <span className="text-sm text-gray-500">Pada {createdDate}</span>
            </div>
            <div className="bg-gray-100 mx-auto p-6 rounded-lg shadow-md mb-4 lg:w-[300px] w-[350px] h-fit">
              <DetailedInfo
                hari={dataKedai.kedai.jadwal[0].hari}
                jamBuka={dataKedai.kedai.jadwal[0].jamBuka}
                jamTutup={dataKedai.kedai.jadwal[0].jamTutup}
                kontak={dataKedai.kedai.kontak}
                alamat={dataKedai.kedai.alamat}
                fasilitas={dataKedai.kedai.fasilitas}
                menu={dataKedai.kedai.menu[0]}
              />
            </div>
            {dataKedai.kedai.idPemilik === data?.user?.id && (
              <div className="grid grid-cols-2 justify-items-center bg-gray-100 rounded-lg p-6 shadow-md">
                <Link href={`/kedai/edit/${dataKedai.kedai.id}`}>
                  <button className="w-fit bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Edit Kedai
                  </button>
                </Link>
                <button className="w-fit bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                  Hapus Kedai
                </button>
              </div>
            )}
          </div>

          {/* Mobile view */}
          {dataKedai.kedai.idPemilik === data?.user?.id && (
            <div className="w-[350px] mb-4 mx-auto block lg:hidden">
              <div className="grid grid-cols-2 justify-items-center bg-gray-100 rounded-lg p-6 shadow-md">
                <button className="w-fit bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Edit Kedai
                </button>
                <button className="w-fit bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                  Hapus Kedai
                </button>
              </div>
            </div>
          )}
          <div className="bg-gray-100 mx-auto mt-12 pb-6 rounded-lg shadow-md mb-2 lg:w-[800px] w-[350px]">
            <Image
              src={dataKedai?.kedai?.gambar || "/spinner.gif"}
              alt="gambar_kedai"
              width={500}
              height={500}
              className="rounded-xl mx-auto w-full"
              style={{ width: "auto", height: "auto" }}
              priority={true}
            />
            <div className="p-4">
              <h1 className="font-bold lg:text-4xl text-xl border-b-2 pb-2 border-gray-500">
                <div className="grid grid-cols-2">
                  {dataKedai?.kedai?.namaKedai}
                  <p className="justify-self-end self-end">
                    {averageRating}
                    <FontAwesomeIcon
                      icon={faStar}
                      className="text-amber-300 mx-1"
                    />
                  </p>
                </div>
              </h1>
              <p className="mt-2 border-b-2 border-gray-500 pb-2 sm:border-none sm:pb-0">
                {dataKedai?.kedai?.deskripsi || "Tidak ada deskripsi"}
              </p>
              <div className="sm:hidden block mt-2">
                <p className="font-bold">Diposting oleh:</p>
                <div className="flex flex-wrap hover:underline underline-offset-2 w-fit">
                  <Image
                    width={30}
                    height={30}
                    src={
                      dataKedai?.kedai?.pemilik?.fotoProfil ||
                      "/default_pfp.png"
                    }
                    alt="author"
                    className="rounded-full my-2 w-full"
                    style={{ width: "auto", height: "auto" }}
                  />
                  <Link
                    href={`/profile/view/${dataKedai.kedai.idPemilik}`}
                    className="font-bold self-center mx-2"
                  >
                    <span>{dataKedai?.kedai?.pemilik?.nama}</span>
                  </Link>
                </div>
                <p className="text-sm text-gray-500">Pada {createdDate}</p>
                <br />
                <DetailedInfo
                  hari={dataKedai.kedai.jadwal[0].hari}
                  jamBuka={dataKedai.kedai.jadwal[0].jamBuka}
                  jamTutup={dataKedai.kedai.jadwal[0].jamTutup}
                  kontak={dataKedai.kedai.kontak}
                  alamat={dataKedai.kedai.alamat}
                  fasilitas={dataKedai.kedai.fasilitas}
                  menu={dataKedai.kedai.menu[0]}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <ReviewSection />
    </PageLayout>
  );
}
