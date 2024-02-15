"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faStar as solidStar,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { faStarHalfAlt as halfStar } from "@fortawesome/free-solid-svg-icons";
import {
  faArrowCircleRight,
  faArrowCircleLeft,
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Modal from "../Modal/Modal";
import Link from "next/link";

interface ReviewSummaryProps {
  ratings: number[];
}

const ReviewSummary: React.FC<ReviewSummaryProps> = ({ ratings }) => {
  const totalReviews = ratings.reduce((acc, cur) => acc + cur, 0);
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-4 lg:w-[450px] w-[350px]">
      <h2 className="text-lg font-semibold mb-4">Ringkasan Ulasan</h2>
      <div className="grid grid-cols-5 gap-4">
        {stars.map((star, index) => (
          <div key={star} className="flex flex-col items-center">
            <div className="w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center text-xl font-semibold">
              {ratings[index]}
            </div>
            <span className="text-gray-600 mt-2">
              {star}{" "}
              <FontAwesomeIcon icon={solidStar} className="text-amber-300" />
            </span>
          </div>
        ))}
      </div>
      <p className="text-gray-600 mt-4">Total {totalReviews} ulasan</p>
    </div>
  );
};

const Review = ({
  id,
  avatar,
  nama,
  rating,
  komentar,
  dibuatPada,
  openModal,
}) => {
  const renderStars = () => {
    const stars = [];
    const totalStars = 5;
    const roundedRating = Math.round(rating * 2) / 2;
    const solidStars = Math.floor(roundedRating);
    const hasHalfStar = roundedRating % 1 !== 0;

    for (let i = 0; i < solidStars; i++) {
      stars.push(
        <FontAwesomeIcon key={i} icon={solidStar} className="text-amber-300" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <FontAwesomeIcon
          key="half"
          icon={halfStar}
          className="text-amber-300"
        />
      );
    }

    const remainingStars = totalStars - solidStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <FontAwesomeIcon
          key={i + solidStars}
          icon={regularStar}
          className="text-amber-300"
        />
      );
    }

    return stars;
  };

  const { data } = useSession();

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4 lg:w-[500px] w-[350px]">
      <div className="flex flex-wrap justify-between">
        <div className="flex flex-row">
          <Image
            src={avatar}
            alt={avatar + "_avatar"}
            width={35}
            height={30}
            className="rounded-full p-2 w-full"
            style={{ width: "auto", height: "auto" }}
          />
          <div>
            <h3 className="text-lg font-semibold hover:underline underline-offset-2 underline-black">
              <Link href={`/profile/view/${id}`} className="w-fit">
                {nama}
              </Link>
            </h3>
            <div className="flex items-center">
              {renderStars()}{" "}
              <span className="text-gray-600">&nbsp;{rating}</span>
            </div>
          </div>
        </div>
        <div className="">
          <p className="text-gray-500 flex-1">
            {new Date(dibuatPada).toLocaleDateString("id-ID")}
          </p>
        </div>
      </div>
      <div className="flex flex-row">
        <p className="text-gray-600 mx-4 w-full">{komentar}</p>
        {+id === +data?.user?.id && (
          <button onClick={openModal}>
            <FontAwesomeIcon icon={faTrashCan} />
          </button>
        )}
      </div>
    </div>
  );
};

export default function ReviewSection({ initialUlasanData, idKedai }) {
  const [ulasanData, setUlasanData] = useState(initialUlasanData);
  const [sortBy, setSortBy] = useState("");
  const [isTextareaVisible, setTextareaVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    updateUlasanData();
  });

  const closeModal = () => {
    setShowModal(false);
  };

  const handleOpenModal = () => {
    setShowModal(!showModal);
  };

  const handleDeleteButton = async () => {
    setIsLoading(true);
    try {
      const request = await fetch(`/api/ulasan`, {
        method: "DELETE",
      });

      if (!request.ok) throw new Error("Terjadi kesalahan, Coba lagi nanti.");

      const res = await request.json();

      setIsLoading(false);
      setShowModal(false);
      updateUlasanData();

      toast.success(res.success);
    } catch (error: any) {
      setIsLoading(false);
      setShowModal(false);
      return toast.error(error.message);
    }
  };

  const updateUlasanData = async () => {
    try {
      const response = await fetch(`/api/ulasan?id=${idKedai}`, {
        method: "GET",
      });
      const data = await response.json();
      setUlasanData(data.ulasan.ulasan);
    } catch (error) {
      return toast.error(error.message);
    }
  };

  const handleStarClick = (value: number) => {
    setRating(value);
  };

  const toggleTextareaVisibility = () => {
    setTextareaVisible(!isTextareaVisible);
  };

  const reviews = ulasanData;
  const ratings = [0, 0, 0, 0, 0];

  const reviewsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);

  reviews.forEach((review) => {
    const ratingIndex = Math.floor(review.rating) - 1;
    ratings[ratingIndex]++;
  });

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "newest") {
      return (
        new Date(b.dibuatPada).getTime() - new Date(a.dibuatPada).getTime()
      );
    } else if (sortBy === "oldest") {
      return (
        new Date(a.dibuatPada).getTime() - new Date(b.dibuatPada).getTime()
      );
    } else if (sortBy === "highestRating") {
      return b.rating - a.rating;
    } else if (sortBy === "lowestRating") {
      return a.rating - b.rating;
    } else {
      return 0;
    }
  });

  const currentReviews = sortedReviews.slice(
    indexOfFirstReview,
    indexOfLastReview
  );

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const generatePageIndicators = () => {
    const indicators = [];
    let startPage = currentPage - 1;
    let endPage = currentPage + 1;

    if (startPage < 1) {
      startPage = 1;
      endPage = Math.min(totalPages, 3);
    }

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, totalPages - 2);
    }

    for (let i = startPage; i <= endPage; i++) {
      indicators.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`mx-1 py-2 px-4 rounded-full ${
            currentPage === i ? "bg-amber-500 text-white" : "bg-gray-300"
          }`}
        >
          {i}
        </button>
      );
    }

    return indicators;
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const onSubmit = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);

    if (!review) {
      setIsLoading(false);
      return toast.error("Isi ulasan yang ingin diberikan.");
    }
    if (!rating) {
      setIsLoading(false);
      return toast.error("Berikan rating sebelum mengirim ulasan.");
    }

    try {
      const postUlasan = await fetch("/api/ulasan", {
        method: "POST",
        body: JSON.stringify({
          komentar: review,
          rating: rating,
          idKedai: idKedai,
        }),
      });

      const response = await postUlasan.json();

      if (postUlasan.ok) {
        setIsLoading(false);
        updateUlasanData();

        return toast.success(response.success);
      }

      throw new Error(response.error);
    } catch (error: any) {
      setIsLoading(false);
      return toast.error(error.message);
    }
  };

  if (!ulasanData) return;

  return (
    <>
      <Modal
        closeModal={closeModal}
        showModal={showModal}
        message="Yakin ingin menghapus ulasan ini?"
        optionYes="Ya, Hapus"
        optionNo="Batalkan"
        functionYes={handleDeleteButton}
        isLoading={isLoading}
      />
      <div className="flex lg:flex-row flex-col lg:gap-10 gap-2 items-center justify-center">
        <div className="lg:self-start lg:mt-20">
          <ReviewSummary ratings={ratings} />
        </div>
        <div className="flex flex-col items-center p-4">
          <div className="self-end mb-4">
            <button
              className="bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded mx-2"
              onClick={toggleTextareaVisibility}
            >
              {isTextareaVisible ? "Tutup ulasan" : "Berikan ulasan"}
            </button>
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="h-10 border-2 border-gray-500 focus:outline-none focus:border-gray-500 text-gray-500 rounded px-2 md:px-3 py-0 md:py-1 tracking-wider"
            >
              <option value="" disabled>
                Urutkan
              </option>
              <option value="newest">Terbaru</option>
              <option value="oldest">Terlama</option>
              <option value="highestRating">Rating Tertinggi</option>
              <option value="lowestRating">Rating Terendah</option>
            </select>
          </div>

          {isTextareaVisible && (
            <div className="relative w-full">
              <div className="relative w-full min-w-[200px]">
                <textarea
                  className="peer h-full min-h-[100px] w-full resize-none border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
                  placeholder=" "
                  onChange={(event) => setReview(event.target.value)}
                ></textarea>
                <label className="after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-0 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-gray-900 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:after:scale-x-100 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                  Tulis ulasan
                </label>
              </div>
              <div className="flex gap-4 justify-end mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, index) => {
                    const starValue = index + 1;
                    return (
                      <FontAwesomeIcon
                        key={index}
                        icon={starValue <= rating ? solidStar : regularStar}
                        className="text-amber-300 text-xl cursor-pointer"
                        onClick={() => handleStarClick(starValue)}
                      />
                    );
                  })}
                </div>
                <button
                  className="bg-red-500 disabled:bg-gray-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={onSubmit}
                  disabled={isLoading}
                >
                  {(isLoading && (
                    <Image
                      src="/spinner.gif"
                      alt="loading"
                      width={20}
                      height={20}
                    />
                  )) ||
                    "Kirim"}
                </button>
              </div>
            </div>
          )}

          <div className="min-h-[410px]">
            {currentReviews.map((review, index) => (
              <Review
                key={index}
                id={review.penulis?.id}
                avatar={review.penulis?.fotoProfil}
                nama={review.penulis?.nama}
                rating={review.rating}
                komentar={review.komentar}
                dibuatPada={review.dibuatPada}
                openModal={handleOpenModal}
              />
            ))}
            {!(currentReviews.length > 0) && (
              <div className="lg:w-[500px] w-[300px]">
                <Image
                  src="/reviewless.webp"
                  alt="no_review"
                  width={300}
                  height={300}
                  className="lg:w-2/3 mx-auto"
                />
                <p className="text-center text-xl font-semibold">
                  Jadi pengulas pertama yuk!
                </p>
              </div>
            )}
          </div>
          {currentReviews.length > 0 && (
            <div className="flex mt-4">
              <button
                onClick={goToPreviousPage}
                className={`mx-1 py-2 px-4 rounded ${
                  currentPage === 1 ? "text-gray-500" : "text-black"
                }`}
                disabled={currentPage === 1}
              >
                <FontAwesomeIcon icon={faArrowCircleLeft} />
              </button>
              {generatePageIndicators()}
              <button
                onClick={goToNextPage}
                className={`mx-1 py-2 px-4 rounded ${
                  currentPage === totalPages ? "text-gray-500" : "text-black"
                }`}
                disabled={currentPage === totalPages}
              >
                <FontAwesomeIcon icon={faArrowCircleRight} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
