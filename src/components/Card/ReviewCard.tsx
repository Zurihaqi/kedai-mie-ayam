import * as React from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { faStarHalfAlt as halfStar } from "@fortawesome/free-solid-svg-icons";

export default function ReviewCard({ avatar, name, date, review, rating }) {
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

  return (
    <div
      className="rounded-xl shadow-lg bg-white border-gray-300 border p-4 mx-auto h-fit"
      style={{ width: 300 }}
    >
      <div className="flex flex-row border-b-2 pb-4">
        <Image
          src={avatar}
          alt={avatar + "_alt"}
          height={50}
          width={50}
          style={{ width: 50, height: 50 }}
          priority={true}
          className="rounded-full"
        />
        <div className="mx-2 mt-1">
          <p>{name}</p>
          <p>{date}</p>
        </div>
      </div>
      <div className="p-4">
        <div className="font-bold text-lg">{review}</div>
      </div>
      <div className="px-4 pb-2">
        {renderStars()} {rating}
      </div>
    </div>
  );
}
