import * as React from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import "./Card.css";
import Link from "next/link";

export default function Card({ id, image, alt, title, rating, reviews }) {
  return (
    <div
      className="rounded-xl shadow-lg border-gray-300 border mx-auto card-zoom"
      style={{ width: 200, height: 300 }}
    >
      <div className="group relative flex justify-center">
        <Image
          src={image}
          alt={alt}
          width={200}
          height={150}
          style={{ width: "auto", height: "auto" }}
          priority={true}
          className="rounded-xl group-hover:brightness-50 transition-all duration-300 bg-gray-400"
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Link href={`/kedai/detail/${id}`}>
            <button
              aria-label="read-more-btn"
              className="hidden group-hover:block bg-gray-500 text-white hover:bg-opacity-70 bg-opacity-30 p-2 rounded transition-opacity duration-300"
            >
              Rincian
            </button>
          </Link>
        </div>
      </div>
      <div className="px-6 mt-4">
        <div className="font-bold text-lg" style={{ height: 50 }}>
          {title}
        </div>
      </div>
      <div className="px-6">
        <FontAwesomeIcon icon={faStar} className="text-amber-300" /> {rating}{" "}
        <span>• {reviews} ulasan</span>
      </div>
    </div>
  );
}
