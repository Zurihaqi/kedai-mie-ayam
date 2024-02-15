"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import Card from "@/components/Card/Card";
import ReviewCard from "@/components/Card/ReviewCard";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import "animate.css/animate.min.css";
import { AnimationOnScroll as AOS } from "react-animation-on-scroll";

import toast from "react-hot-toast";

export default function Home() {
  const [kedai, setKedai] = React.useState([]);
  const [review, setReview] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const data = await fetch("api/homepage", {
          method: "GET",
        });

        const res = await data.json();
        if (!data.ok) throw new Error(res.error);

        if (res) {
          setIsLoading(false);
          setKedai(res.kedai);
          return setReview(res.ulasan);
        }
      } catch (error: any) {
        setIsLoading(false);
        return toast.error(error.message);
      }
    };

    getData();
  }, []);

  return (
    <>
      <section className="bg-gradient-to-b from-[#F59E0B] to-amber-400 rounded-b-3xl overflow-hidden">
        <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
          <div className="mr-auto place-self-center lg:col-span-7">
            <AOS
              animateIn="animate__fadeInLeft"
              animateOut="animate__fadeOutLeft"
              initiallyVisible={true}
            >
              <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl">
                Selamat Datang di Kedai Mie Ayam
              </h1>
              <p className="max-w-2xl mb-6 font-light text-black lg:mb-8 md:text-lg lg:text-xl">
                Tingkatkan Petualangan Kuliner Anda: Temukan Mie Ayam Terbaik di
                Sekitar Anda dengan Aplikasi Review Kami!
              </p>
              <Link
                href="/search"
                className="animated-underline inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-black rounded-lg"
              >
                Cari Kedai
                <svg
                  className="w-5 h-5 ml-2 -mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </Link>
              <Link
                href="/kedai/post/"
                className="animated-underline inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-black rounded-lg"
              >
                Daftarkan Kedai Anda
              </Link>
            </AOS>
          </div>
          <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
            <AOS
              animateIn="animate__fadeInRight"
              animateOut="animate__fadeOutRight"
              initiallyVisible={true}
            >
              <Image
                src="/mie_ayam.webp"
                alt="hero_image"
                width={500}
                height={500}
                style={{ width: "auto", height: "auto" }}
                className="animate__animated animate__fadeInRight"
              />
            </AOS>
          </div>
        </div>
      </section>

      {/* Kedai Terpopuler */}
      <div className="lg:px-14 mt-12 sm:overflow-visible overflow-hidden">
        <div className="px-2 mb-10">
          <h1 className="sm:text-2xl text-xl font-semibold">
            Kedai Terpopuler
          </h1>
          <p>
            Temukan Kesempurnaan Mie Ayam: Berbagai Pilihan Kedai Terpopuler!
          </p>
        </div>
        {kedai.length <= 0 && !isLoading && (
          <div className="w-[350px] mx-auto">
            <Image
              src="/empty_kedai.webp"
              alt="empty_kedai"
              width={300}
              height={300}
              style={{ width: "auto", height: "auto" }}
              priority={true}
            />
            <h1 className="font-bold lg:text-2xl text-lg text-center">
              Waduh belum ada kedai yang diposting...
            </h1>
          </div>
        )}
        <Swiper
          centeredSlides={true}
          breakpoints={{
            0: { slidesPerView: 1 },
            640: { slidesPerView: 3 },
          }}
          className="mx-auto w-full"
        >
          {kedai.length > 0 && !isLoading ? (
            kedai.map((kedai, index) => (
              <SwiperSlide key={index} className="my-6 px-6">
                <Card
                  key={kedai.id}
                  id={kedai.id}
                  image={kedai.gambar}
                  alt={kedai.namaKedai + "_alt"}
                  title={kedai.namaKedai}
                  rating={kedai.averageRating}
                  reviews={kedai.ulasan?.length}
                />
              </SwiperSlide>
            ))
          ) : (
            <div className="mx-auto p-12 w-fit text-center">
              <Image
                src="/spinner.gif"
                alt="loading"
                width={50}
                height={50}
                style={{ width: "auto", height: "auto" }}
              />
              <h1 className="font-bold text-xl">Memuat...</h1>
            </div>
          )}
        </Swiper>
      </div>

      {/* Ulasan Terkini */}
      <div className="lg:px-14 mt-12 pb-10 bg-gradient-to-b from-white to-slate-200 w-full overflow-hidden">
        <div className="px-2 mb-10">
          <h1 className="sm:text-2xl text-xl pt-8 font-semibold">
            Ulasan Terbaru
          </h1>
          <p>
            Menyajikan Ulasan Terkini: Temukan Berita Terbaru dan Terhangat di
            Dunia Mie Ayam!
          </p>
        </div>
        {review.length <= 0 && !isLoading && (
          <div className="w-[350px] mx-auto">
            <Image
              src="/reviewless.webp"
              alt="empty_review"
              width={300}
              height={300}
              style={{ width: "auto", height: "auto" }}
              priority={true}
            />
            <h1 className="font-bold lg:text-2xl text-lg text-center">
              Masih sepi nih...
            </h1>
          </div>
        )}
        <Swiper
          centeredSlides={true}
          breakpoints={{
            0: { slidesPerView: 1 },
            640: { slidesPerView: 3 },
          }}
          className="mx-auto w-full"
        >
          {review.length > 0 && !isLoading ? (
            review.map((ulasan, index) => (
              <SwiperSlide key={index}>
                <ReviewCard
                  key={index}
                  id={ulasan.penulis.id}
                  avatar={ulasan.penulis.fotoProfil}
                  name={ulasan.penulis.nama}
                  date={new Date(ulasan.dibuatPada).toLocaleDateString("id-ID")}
                  review={ulasan.komentar}
                  rating={ulasan.rating}
                />
              </SwiperSlide>
            ))
          ) : (
            <div className="mx-auto p-12 w-fit text-center">
              <Image
                src="/spinner.gif"
                alt="loading"
                width={50}
                height={50}
                style={{ width: "auto", height: "auto" }}
              />
              <h1 className="font-bold text-xl">Memuat...</h1>
            </div>
          )}
        </Swiper>
      </div>
    </>
  );
}
