"use client";

import * as React from "react";
import PageLayout from "@/components/PageLayout/Layout";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Card from "@/components/Card/Card";
import ReviewCard from "@/components/Card/ReviewCard";
import toast from "react-hot-toast";
import { signOut } from "next-auth/react";
import Modal from "@/components/Modal/Modal";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReactOwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

export default function ViewProfile({ params }: { params: { id: string } }) {
  const [userData, setUserData] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [createdDate, setCreatedDate] = React.useState(null);
  const [updatedDate, setUpdatedDate] = React.useState(null);
  const [averageKedaiRating, setAverageKedaiRating] = React.useState(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  const modalToggle = () => {
    setShowModal(!showModal);
  };

  React.useEffect(() => {
    const getUserData = async () => {
      const { id } = params;

      try {
        const user = await fetch(`/api/user?id=${id}`, {
          method: "GET",
        });

        if (!user.ok) {
          return router.push("/profile/not-found");
        }

        const res = await user.json();

        setAverageKedaiRating(calculateAverageRating(res.user.kedai));
        setCreatedDate(new Date(res.user.dibuatPada).toLocaleDateString());
        setUpdatedDate(new Date(res.user.diubahPada).toLocaleDateString());
        return setUserData(res);
      } catch (error: any) {
        return toast.error(error.message);
      }
    };

    getUserData();
  }, [params]);

  const handleDeleteButton = async () => {
    setIsLoading(true);
    const id = session.user?.id;

    try {
      const request = await fetch(`/api/user?id=${id}`, {
        method: "DELETE",
      });

      if (!request.ok) throw new Error("Terjadi kesalahan, Coba lagi nanti.");

      await signOut({ redirect: false });
      setIsLoading(false);
      setShowModal(false);
      return Promise.resolve(router.push("/login")).then(() =>
        toast.success("Berhasil menghapus akun!")
      );
    } catch (error: any) {
      setIsLoading(false);
      setShowModal(false);
      return toast.error(error.message);
    }
  };

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
      {(!userData && (
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
        <div>
          <Modal
            show={showModal}
            message="Yakin ingin menghapus akun anda?"
            optionYes="Ya, Hapus"
            optionNo="Batalkan"
            functionYes={handleDeleteButton}
            isLoading={isLoading}
          />
          <div className="p-12 w-fit mx-auto">
            <div className="bg-gray-100 p-8 rounded-xl shadow-lg mx-auto flex flex-col lg:gap-8 gap-4">
              <div className="flex lg:flex-row flex-col gap-8">
                <div className="w-full">
                  <Image
                    src={
                      userData?.user.fotoProfil
                        ? userData?.user.fotoProfil
                        : "/spinner.gif"
                    }
                    alt="avatar"
                    width={100}
                    height={100}
                    style={{ width: 100, height: 100 }}
                    className="rounded-full mx-auto"
                  />
                  <p className="text-xl font-bold text-center mt-4">
                    {userData?.user.nama}
                  </p>
                  <div className="text-center">
                    <p>{userData.user.kedai.length} Kedai</p>
                    <p>{userData.user.ulasan.length} Ulasan</p>
                    <p className="text-center mt-4 font-semibold">
                      Bergabung: {createdDate}
                    </p>
                    <p className="text-center font-semibold">
                      Diperbarui: {updatedDate}
                    </p>
                  </div>
                </div>
                <div className="lg:min-w-[300px] border-l-2 border-gray-500 px-4 flex flex-col gap-4">
                  <div className="h-full">
                    <p className="font-bold text-start text-lg">Bio</p>
                    <p>
                      {userData?.user.bio
                        ? userData?.user.bio
                        : "Pengguna ini belum mengisi bio."}
                    </p>
                  </div>
                  <div
                    className={`${
                      +userData?.user?.id === +session?.user?.id
                        ? "block"
                        : "hidden"
                    } mx-auto space-x-2 flex flex-row`}
                  >
                    <Link
                      href={`/profile/edit/${session?.user?.id}`}
                      className="p-2 text-center rounded-lg bg-blue-500 hover:bg-blue-700 text-sm font-bold text-white w-fit"
                    >
                      Ubah profil
                    </Link>
                    <button
                      onClick={modalToggle}
                      className="p-2 rounded-lg bg-red-500 hover:bg-red-700 text-sm font-bold text-white w-fit"
                    >
                      Hapus akun
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="pb-12 flex flex-col gap-10">
            <div className="space-y-8">
              <h1 className="text-3xl font-bold mx-12 border-b-2 border-gray-500 px-2 pb-2">
                Kedai
              </h1>
              {(userData.user.kedai.length > 0 && (
                <div className="flex flex-row overflow-hidden">
                  <ReactOwlCarousel
                    style={{ maxWidth: 800 }}
                    className="mx-auto my-8"
                    responsive={{
                      0: {
                        loop: true,
                        autoWidth: true,
                        margin: 50,
                        center: true,
                      },
                      640: {
                        items: 3,
                        mergeFit: true,
                      },
                    }}
                  >
                    {userData.user?.kedai?.map((kedai: any) => (
                      <Card
                        key={kedai.id}
                        id={kedai.id}
                        image={kedai.gambar}
                        alt={kedai.namaKedai + "_alt"}
                        title={kedai.namaKedai}
                        rating={averageKedaiRating}
                        reviews={kedai.ulasan?.length}
                      />
                    ))}
                  </ReactOwlCarousel>
                </div>
              )) || (
                <h1 className="font-bold lg:text-xl text-lg text-center">
                  Pengguna ini belum mengunggah kedai.
                </h1>
              )}
            </div>

            <div className="space-y-8">
              <h1 className="text-3xl font-bold mx-12 border-b-2 border-gray-500 px-2 pb-2">
                Ulasan
              </h1>
              {(userData.user.ulasan.length > 0 && (
                <div className="flex flex-row">
                  {userData.user?.ulasan?.map((ulasan: any) => (
                    <ReviewCard
                      avatar={userData.user.fotoProfil || "/default_pfp.png"}
                      name={userData.user.nama}
                      date={ulasan.dibuatPada}
                      rating={ulasan.rating}
                      review={ulasan.komentar}
                    />
                  ))}
                </div>
              )) || (
                <h1 className="font-bold lg:text-xl text-lg text-center">
                  Pengguna ini belum pernah membuat ulasan.
                </h1>
              )}
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
