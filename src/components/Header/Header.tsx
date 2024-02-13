"use client";

import * as React from "react";
import Logo from "../../../public/logo.png";
import Image from "next/image";
import "./Header.css";
import "delicious-hamburgers/dist/hamburgers.min.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faIdCard,
  faArrowRightFromBracket,
  faAngleUp,
} from "@fortawesome/free-solid-svg-icons";

const DropdownMenu = () => {
  const dropdownRef = React.useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const { data } = useSession();

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/login";
  const currentPage = usePathname();

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handleClickOutside = (event: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  const handleSignOut = async () => {
    const signedOut = await signOut({ redirect: false });
    if (signedOut) {
      Promise.resolve(router.push(callbackUrl)).then(() =>
        toast.success("Anda telah keluar!")
      );
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center py-1 rounded-xl"
      >
        <Image
          src={data.user?.image ? data.user?.image : "/spinner.gif"}
          width={25}
          height={20}
          style={{ width: "auto", height: "auto" }}
          alt="user_pfp"
          className="rounded-full mx-2"
        />
        <span
          className={`font-medium rounded-lg text-sm py-2 mr-2 animated-underline ${
            isDropdownOpen ? "active" : ""
          }`}
        >
          <p className="lg:inline hidden mx-1">{data?.user?.name}</p>
          <FontAwesomeIcon
            className={`transition-transform duration-300 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
            icon={faAngleUp}
          />
        </span>
      </button>
      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-48 bg-[#FFD15D] rounded-md shadow-lg z-10"
        >
          <ul className="py-2 text-center">
            <li className="">
              <Link
                href={`/profile/view/${data?.user?.id}`}
                className={`${
                  currentPage === `/profile/view/${data?.user?.id}`
                    ? "active bg-amber-500"
                    : ""
                } block animated-underline py-2 font-semibold hover:bg-amber-500 transition-colors duration-300`}
              >
                <FontAwesomeIcon icon={faIdCard} />
                &nbsp;Profil
              </Link>
            </li>
            <li className="">
              <button
                onClick={handleSignOut}
                className="block w-full animated-underline py-2 font-semibold hover:bg-amber-500 transition-colors duration-300"
              >
                <FontAwesomeIcon icon={faArrowRightFromBracket} /> Keluar
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default function Header() {
  const [MobileMenu, setMobileMenu] = React.useState(false);
  const [prevScrollPos, setPrevScrollPos] = React.useState(0);
  const [visible, setVisible] = React.useState(true);
  const currentPage = usePathname();
  const { data, status } = useSession();

  const handleScroll = () => {
    const currentScrollPos = window.scrollY;
    setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
    setPrevScrollPos(currentScrollPos);
  };

  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos, visible]);

  const openMenu = () => {
    setMobileMenu(!MobileMenu);
  };

  return (
    <header
      className={`z-10 sticky top-0 transition-transform duration-500 ${
        MobileMenu ? "" : visible ? "translate-y-0" : "-translate-y-[155%]"
      }`}
    >
      <nav className="bg-amber-500 border-gray-200 px-4 lg:px-6 py-2.5">
        <div className="grid justify-items-stretch lg:flex lg:justify-between mx-auto max-w-screen-xl">
          <a href="/">
            <div className="bg-[#FFD15D] absolute top-0" style={{ height: 80 }}>
              <Image
                width={100}
                height={100}
                src={Logo}
                className="h-6 sm:h-9 mt-8"
                alt="Logo"
                style={{ width: "auto", height: "auto" }}
                priority={true}
              />
            </div>
          </a>
          <div className="flex items-center lg:order-2 justify-self-end">
            {status === "loading" && (
              <Image src="/spinner.gif" alt="loading" width={30} height={30} />
            )}
            {status === "unauthenticated" && (
              <>
                <Link
                  href="/login"
                  className={`${
                    currentPage === "/login" ? "active" : ""
                  } animated-underline font-medium rounded-lg text-sm px-4 lg:px-5 py-2 mr-2`}
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className={`${
                    currentPage === "/register" ? "active" : ""
                  } animated-underline font-medium rounded-lg text-sm px-4 lg:px-5 py-2 mr-2`}
                >
                  Daftar
                </Link>
              </>
            )}
            {status === "authenticated" && data && (
              <>
                <DropdownMenu />
              </>
            )}
            <div className="lg:hidden">
              <button
                className={`hamburger hamburger--criss-cross ${
                  MobileMenu ? "active" : ""
                }`}
                type="button"
                onClick={openMenu}
                aria-label="sidebar-toggle"
                style={{ transform: "scale(0.8)" }}
              >
                <div className="inner">
                  <span className="bar"></span>
                  <span className="bar"></span>
                  <span className="bar"></span>
                </div>
              </button>
            </div>
          </div>
          <div
            className={`${
              MobileMenu ? "block" : "hidden"
            } justify-between items-center w-full lg:flex lg:w-auto lg:order-1 lg:ml-52 transition-transform duration-300`}
            id="mobile-menu"
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0 text-end">
              <li>
                <Link
                  href="/search"
                  className={`${
                    currentPage === "/search" ? "active" : ""
                  } block py-2 pr-4 pl-3 animated-underline`}
                >
                  Cari Kedai
                </Link>
              </li>
              <li>
                <Link
                  href="/kedai/post"
                  className={`${
                    currentPage === "/kedai/post" ? "active" : ""
                  } block py-2 pr-4 pl-3 animated-underline`}
                >
                  Daftarkan Kedai Anda
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className={`${
                    currentPage === "/about" ? "active" : ""
                  } block py-2 pr-4 pl-3 animated-underline`}
                >
                  Tentang Kami
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
