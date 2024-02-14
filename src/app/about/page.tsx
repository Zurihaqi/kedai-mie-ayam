"use client";

import * as React from "react";
import Image from "next/image";
import Logo from "../../../public/logo.png";

export default function About() {
  return (
    <>
      <div className="bg-[#FFD15D]">
        <Image
          src={Logo}
          alt="Logo"
          style={{ width: "auto", height: "auto", maxHeight: 250 }}
          priority={true}
          className="mx-auto"
        />
      </div>
      <div className="m-12 border border-gray-300 rounded-xl shadow-md p-4">
        <h1 className="lg:text-2xl text-xl text-center font-semibold">
          Tentang Kedai Mie Ayam
        </h1>
        <p className="text-center my-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
          porttitor sem ac finibus lobortis. Nullam tincidunt turpis velit, ut
          blandit turpis euismod vel. Praesent ut venenatis turpis. Etiam in
          dolor erat. Curabitur non finibus turpis, sit amet consectetur eros.
          Sed scelerisque urna eleifend nisi pretium, eleifend iaculis erat
          accumsan. Quisque egestas aliquam orci, sit amet accumsan justo
          eleifend eu. Suspendisse potenti. Nunc enim velit, cursus sit amet
          rhoncus ut, vulputate ut elit. Suspendisse non dui id tortor malesuada
          viverra vel eu lacus. In hac habitasse platea dictumst. Nam cursus
          ligula vel iaculis lacinia. Donec erat lorem, consequat eu erat quis,
          vulputate rutrum odio. Nunc tincidunt eget nisl nec vehicula.
        </p>
      </div>
      <div className="m-12 border border-gray-300 rounded-xl shadow-md p-4">
        <h1 className="lg:text-2xl text-xl text-center font-semibold">
          Tentang Sequential Search
        </h1>
        <p className="text-center my-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
          porttitor sem ac finibus lobortis. Nullam tincidunt turpis velit, ut
          blandit turpis euismod vel. Praesent ut venenatis turpis. Etiam in
          dolor erat. Curabitur non finibus turpis, sit amet consectetur eros.
          Sed scelerisque urna eleifend nisi pretium, eleifend iaculis erat
          accumsan. Quisque egestas aliquam orci, sit amet accumsan justo
          eleifend eu. Suspendisse potenti. Nunc enim velit, cursus sit amet
          rhoncus ut, vulputate ut elit. Suspendisse non dui id tortor malesuada
          viverra vel eu lacus. In hac habitasse platea dictumst. Nam cursus
          ligula vel iaculis lacinia. Donec erat lorem, consequat eu erat quis,
          vulputate rutrum odio. Nunc tincidunt eget nisl nec vehicula.
        </p>
      </div>
    </>
  );
}
