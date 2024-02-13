"use client";

import * as React from "react";
import PageLayout from "@/components/PageLayout/Layout";
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
      try {
        const kedai = await fetch(`/api/kedai/`, {
          method: "GET",
        });

        const res = await kedai.json();
        setAverageRating(calculateAverageRating(kedai));
        setSearchResult(res.kedai);
        return setDataKedai(res);
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
      // Ulasan terbanyak
      case "MostReviews":
        sortedData.sort((a, b) => {
          const reviewsA = a.ulasan ? a.ulasan.length : 0;
          const reviewsB = b.ulasan ? b.ulasan.length : 0;
          return reviewsB - reviewsA;
        });
        break;
      // Ulasan paling sedikit
      case "LessReviews":
        sortedData.sort((a, b) => {
          const reviewsA = a.ulasan ? a.ulasan.length : 0;
          const reviewsB = b.ulasan ? b.ulasan.length : 0;
          return reviewsA - reviewsB;
        });
        break;
      // Rating tertinggi
      case "HighestRated":
        sortedData.sort((a, b) => {
          const ratingA = calculateAverageRating(a);
          const ratingB = calculateAverageRating(b);
          return ratingB - ratingA;
        });
        break;
      // Rating terendah
      case "LowestRated":
        sortedData.sort((a, b) => {
          const ratingA = calculateAverageRating(a);
          const ratingB = calculateAverageRating(b);
          return ratingA - ratingB;
        });
        break;
      default:
        break;
    }

    return sortedData;
  };

  // Hitung rata-rata rating kedai
  const calculateAverageRating = (kedai) => {
    if (!kedai.ulasan || kedai.ulasan.length === 0) return 0;

    let totalRating = 0;
    kedai.ulasan.forEach((ulasan) => {
      totalRating += ulasan.rating;
    });

    const averageRating = totalRating / kedai.ulasan?.rating?.length;
    return averageRating;
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
    setSearchResult(hasil);
    setIsloading(false);
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
    <PageLayout>
      <div className="p-10">
        <form
          className="flex flex-col md:flex-row gap-3 justify-center"
          onSubmit={jalankanPencarian}
        >
          <div className="flex">
            <input
              type="text"
              placeholder="Cari kedai..."
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
            <option value="MostReviews">Ulasan Paling Banyak</option>
            <option value="LessReviews">Ulasan Paling Sedikit</option>
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
                  rating={averageRating}
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
    </PageLayout>
  );
}
