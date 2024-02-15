"use client";

import * as React from "react";
import ReviewSection from "@/components/ReviewSection/ReviewSection";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Modal from "@/components/Modal/Modal";
import { useRouter } from "next/navigation";

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
  const [dataUlasan, setDataUlasan] = React.useState([]);
  const [averageRating, setAverageRating] = React.useState(0);
  const [createdDate, setCreatedDate] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const { data } = useSession();
  const router = useRouter();

  const modalToggle = () => {
    setShowModal(!showModal);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  React.useEffect(() => {
    const getKedaiData = async () => {
      try {
        const kedai = await fetch(`/api/kedai?id=${params.id}`, {
          method: "GET",
        });

        const res = await kedai.json();

        if (kedai.ok) {
          setCreatedDate(
            new Date(res.kedai.dibuatPada).toLocaleDateString("id-ID")
          );

          return setDataKedai(res);
        }

        throw new Error(res.error);
      } catch (error: any) {
        return toast.error(error.message);
      }
    };

    const getUlasanData = async () => {
      try {
        const ulasan = await fetch(`/api/ulasan?id=${params.id}`, {
          method: "GET",
        });

        const res = await ulasan.json();

        if (ulasan.ok) {
          setAverageRating(res.ulasan.averageRating);
          return setDataUlasan(res.ulasan.ulasan);
        }

        throw new Error(res.error);
      } catch (error: any) {
        return toast.error(error.message);
      }
    };

    getUlasanData();
    getKedaiData();
  }, []);

  const handleDeleteButton = async () => {
    setIsLoading(true);
    try {
      const request = await fetch(`/api/kedai?id=${params.id}`, {
        method: "DELETE",
      });

      if (!request.ok) throw new Error("Terjadi kesalahan, Coba lagi nanti.");

      setIsLoading(false);
      setShowModal(false);
      return Promise.resolve(router.push("/search")).then(() =>
        toast.success("Berhasil menghapus kedai!")
      );
    } catch (error: any) {
      setIsLoading(false);
      setShowModal(false);
      return toast.error(error.message);
    }
  };

  if (!dataKedai || !dataUlasan) return;

  return (
    <>
      <Modal
        closeModal={closeModal}
        showModal={showModal}
        message="Yakin ingin menghapus kedai ini?"
        optionYes="Ya, Hapus"
        optionNo="Batalkan"
        functionYes={handleDeleteButton}
        isLoading={isLoading}
      />
      <div className="flex lg:flex-row flex-col-reverse max-w-[1000px] mx-auto lg:gap-4 gap-2">
        <div className="lg:flex flex-col lg:mt-12 hidden">
          <div className="text-center bg-gray-100 mx-auto p-2 px-4 rounded-lg shadow-md mb-4 lg:w-[300px] w-[350px] max-h-max">
            <p className="font-bold">Diposting oleh:</p>
            <div className="flex flex-wrap hover:underline underline-offset-2 w-fit mx-auto">
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
              <button
                onClick={modalToggle}
                className="w-fit bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Hapus Kedai
              </button>
            </div>
          )}
        </div>

        {/* Mobile view */}
        {dataKedai.kedai.idPemilik === data?.user?.id && (
          <div className="w-[350px] mb-4 mx-auto block lg:hidden">
            <div className="grid grid-cols-2 justify-items-center bg-gray-100 rounded-lg p-6 shadow-md">
              <Link href={`/kedai/edit/${dataKedai.kedai.id}`}>
                <button className="w-fit bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Edit Kedai
                </button>
              </Link>
              <button
                onClick={modalToggle}
                className="w-fit bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
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
              <div className="grid grid-cols-4">
                <p className="col-span-3">{dataKedai?.kedai?.namaKedai}</p>
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
            <div className="lg:hidden block mt-2">
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
      <ReviewSection
        initialUlasanData={dataUlasan}
        idKedai={dataKedai.kedai.id}
      />
    </>
  );
}
