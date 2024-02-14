"use client";

import NotFoundSVG from "../../public/404.svg";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Page404() {
  const router = useRouter();

  return (
    <section className="bg-white">
      <div className="container min-h-screen px-6 py-12 mx-auto lg:flex lg:items-center lg:gap-12">
        <div className="w-full lg:w-1/2">
          <p className="text-sm font-medium text-amber-500 ">404 error</p>
          <h1 className="mt-3 text-2xl font-semibold text-gray-800 ">
            Terpantau sepi kedai!
          </h1>
          <p className="mt-4 text-gray-500 ">
            Halaman yang dituju tidak ditemukan.
          </p>

          <div className="flex items-center mt-6 gap-x-3">
            <button
              className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto"
              onClick={() => router.back()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5 rtl:rotate-180"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                />
              </svg>

              <span>Kembali</span>
            </button>

            <Link href="/">
              <button className="w-fit px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-amber-500 rounded-lg shrink-0 sm:w-auto hover:bg-amber-600">
                Ke Halaman Utama
              </button>
            </Link>
          </div>
        </div>

        <div className="relative w-full mt-12 lg:w-1/2 lg:mt-0">
          <Image
            className="w-full max-w-lg lg:mx-auto"
            src={NotFoundSVG}
            alt="not_found_logo"
          />
        </div>
      </div>
    </section>
  );
}
