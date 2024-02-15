"use client";

import * as React from "react";
import Card from "@/components/Card/Card";
import toast from "react-hot-toast";
import Image from "next/image";
import "animate.css";

export default function Search() {
  const [dataKedai, setDataKedai] = React.useState(null);
  const [sortBy, setSortBy] = React.useState("All");
  const [kataPencarian, setKataPencarian] = React.useState("");
  const [searchResult, setSearchResult] = React.useState("");
  const [averageRating, setAverageRating] = React.useState(null);
  const [isLoading, setIsloading] = React.useState(false);

  React.useEffect(() => {
    const getKedaiData = async () => {
      setIsloading(true);
      try {
        const kedai = await fetch(`/api/kedai/`, {
          method: "GET",
        });

        const res = await kedai.json();

        if (res) {
          setSearchResult(res.kedai);
          setIsloading(false);

          return setDataKedai(res);
        }
      } catch (error: any) {
        return toast.error(error.message);
      }
    };

    getKedaiData();
  }, []);

  // Fungsi sortir
  const sortKedaiData = () => {
    let dataToSort = searchResult || dataKedai?.kedai || [];

    if (sortBy === "All") return dataToSort;

    let sortedData = [...dataToSort];

    switch (sortBy) {
      // Kedai terbaru
      case "Newest":
        sortedData.sort((a, b) => {
          const dateA = new Date(a.dibuatPada).getTime();
          const dateB = new Date(b.dibuatPada).getTime();
          return dateB - dateA;
        });
        break;
      // Kedai terlama
      case "Oldest":
        sortedData.sort((a, b) => {
          const dateA = new Date(a.dibuatPada).getTime();
          const dateB = new Date(b.dibuatPada).getTime();
          return dateA - dateB;
        });
        break;
      // Rating tertinggi
      case "HighestRated":
        sortedData.sort((a, b) => {
          const ratingA = a.averageRating;
          const ratingB = b.averageRating;
          return ratingB - ratingA;
        });
        break;
      // Rating terendah
      case "LowestRated":
        sortedData.sort((a, b) => {
          const ratingA = a.averageRating;
          const ratingB = b.averageRating;
          return ratingA - ratingB;
        });
        break;
      default:
        break;
    }

    return sortedData;
  };

  const jalankanPencarian = (event: any) => {
    event.preventDefault();
    setIsloading(true);

    // Jika data kedai kosong, kembalikan pesan
    if (!dataKedai.kedai || dataKedai.kedai.length === 0) {
      setIsloading(false);
      return toast.error("Data kedai masih kosong");
    }

    // Jalankan pencarian
    const hasil = sequentialSearch(kataPencarian);

    // Simpan hasil pencarian ke state
    if (hasil) {
      setSearchResult(hasil);
      setIsloading(false);
    }
  };
  // Proses sequential search
  const sequentialSearch = (pencarian: string) => {
    if (!pencarian) return dataKedai?.kedai; // Tampilkan semua kedai jika kotak pencarian kosong

    // Array untuk menyimpan hasil
    const hasilPencarian = [];
    // Ubah teks pencarian ke huruf kecil
    const lowerCasePencarian = pencarian.toLowerCase();
    // Ubah nama-nama kedai ke huruf kecil
    const lowerCaseNamaKedai = dataKedai?.kedai?.map((kedai: any) =>
      kedai.namaKedai.toLowerCase()
    );

    // Proses looping
    for (let i = 0; i < dataKedai?.kedai?.length; i++) {
      // Jika data yang dicari ditemukan:
      if (lowerCaseNamaKedai[i].includes(lowerCasePencarian)) {
        // Masukan hasil ke dalam array hasil pencarian
        hasilPencarian.push(dataKedai?.kedai[i]);
        break; // Hentikan pencarian
      }
    }
    return hasilPencarian; // Kembalikan hasil pencarian
  };

  return (
    <>
      <div className="p-10">
        <form
          className="flex flex-col md:flex-row gap-3 justify-center"
          onSubmit={jalankanPencarian}
        >
          <div className="flex">
            <input
              type="text"
              placeholder={isLoading ? "Mencari..." : "Cari kedai..."}
              className="w-full md:w-80 px-3 h-10 rounded-l border-2 border-gray-500 focus:outline-none focus:border-gray-500"
              onChange={(e) => setKataPencarian(e.target.value)}
            />
            <button
              type="submit"
              className="bg-gray-500 text-white rounded-r px-2 md:px-3 py-0 md:py-1"
            >
              {isLoading && (
                <Image
                  src="/spinner.gif"
                  alt="loading"
                  width={20}
                  height={20}
                />
              )}
              {!isLoading && "Cari"}
            </button>
          </div>
          <select
            id="sortby"
            name="sortby"
            className="lg:w-1/5 h-10 border-2 border-gray-500 focus:outline-none focus:border-gray-500 text-gray-500 rounded px-2 md:px-3 py-0 md:py-1 tracking-wider"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="All" defaultChecked>
              Urutkan
            </option>
            <option value="Newest">Terbaru</option>
            <option value="Oldest">Terlama</option>
            <option value="HighestRated">Rating Tertinggi</option>
            <option value="LowestRated">Rating Terendah</option>
          </select>
        </form>
      </div>
      {dataKedai?.kedai && (
        <div className="px-12 pb-12 grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-8">
          {sortKedaiData().map((kedai: any) => {
            return (
              <div className="animate__animated animate__bounceIn">
                <Card
                  key={kedai.id}
                  id={kedai.id}
                  image={kedai.gambar}
                  alt={kedai.namaKedai + "_alt"}
                  title={kedai.namaKedai}
                  rating={kedai.averageRating}
                  reviews={kedai.ulasan?.length}
                />
              </div>
            );
          })}
        </div>
      )}
      {!dataKedai?.kedai ||
        (searchResult.length === 0 && (
          <div className="w-fit mx-auto">
            <Image
              src="/empty_kedai.webp"
              alt="empty_kedai"
              width={300}
              height={300}
              style={{ width: "auto", height: "auto" }}
              priority={true}
            />
            <h1 className="text-3xl font-bold text-center">
              Kedai tidak ditemukan.
            </h1>
          </div>
        ))}
    </>
  );
}
