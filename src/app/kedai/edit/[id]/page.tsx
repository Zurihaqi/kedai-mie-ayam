"use client";

import * as React from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EditKedai({ params }: { params: { id: string } }) {
  const [currentKedaiData, setCurrentKedaiData] = React.useState(null);
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [imageToUpload, setImageToUpload] = React.useState(null);
  const [isLoading, setIsloading] = React.useState(false);
  const [menu, setMenu] = React.useState([]);
  const [makanan, setMakanan] = React.useState("");
  const [harga, setHarga] = React.useState("");
  const [formData, setFormData] = React.useState({
    namaKedai: "",
    kontak: "",
    deskripsi: "",
    alamat: "",
    fasilitas: "",
    hari: "",
    jamBuka: "",
    jamTutup: "",
    makanan: "",
    harga: "",
  });

  const router = useRouter();
  let hasValue = false;

  React.useEffect(() => {
    const getKedaiData = async () => {
      const { id } = params;

      try {
        const user = await fetch(`/api/kedai?id=${id}`, {
          method: "GET",
        });

        if (!user.ok) {
          return router.push("/kedai/not-found");
        }

        const res = await user.json();

        const splitMakanan = res.kedai.menu[0].makanan.split(";");
        const splitHarga = res.kedai.menu[0].harga.split(";");

        const initialMenu = [];

        for (let i = 0; i < splitMakanan.length; i++) {
          initialMenu.push({
            makanan: splitMakanan[i],
            harga: splitHarga[i],
          });
        }

        setMenu(initialMenu);
        setFormData({
          ...formData,
          makanan: res.kedai.menu[0].makanan,
          harga: res.kedai.menu[0].harga,
        });

        return setCurrentKedaiData(res.kedai);
      } catch (error: any) {
        return toast.error(error.message);
      }
    };

    getKedaiData();
  }, [params]);

  const addMenu = () => {
    if (makanan.trim() !== "" && harga.trim() !== "") {
      const formattedMakanan =
        makanan.charAt(0).toUpperCase() + makanan.slice(1);
      const formattedHarga = "Rp" + addDotForThousands(harga.trim());

      const updatedMenu = [
        ...menu,
        {
          makanan: formattedMakanan,
          harga: formattedHarga,
        },
      ];

      const serializedMakanan = updatedMenu
        .map((item) => item.makanan)
        .join(";");
      const serializedHarga = updatedMenu.map((item) => item.harga).join(";");

      setFormData({
        ...formData,
        makanan: serializedMakanan,
        harga: serializedHarga,
      });

      setMenu(updatedMenu);
      setMakanan("");
      setHarga("");
    }
  };

  const clearMenu = () => {
    setMenu([]);
    setFormData({
      ...formData,
      makanan: "",
      harga: "",
    });
  };

  const deleteMenuItem = (index) => {
    const updatedMenu = [...menu];
    updatedMenu.splice(index, 1);
    setMenu(updatedMenu);

    if (updatedMenu.length === 0) {
      setFormData({
        ...formData,
        makanan: "",
        harga: "",
      });
    } else {
      const lastMenuItem = updatedMenu[updatedMenu.length - 1];
      setFormData({
        ...formData,
        makanan: lastMenuItem.makanan,
        harga: lastMenuItem.harga,
      });
    }
  };

  const addDotForThousands = (value) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "fasilitas") {
      if (value) {
        const serializedFasilitas = value
          .split(",")
          .map((item) => item.trim().replace(/\s+/g, "-"));
        setFormData({
          ...formData,
          [name]: serializedFasilitas,
        });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (event: any) => {
    let file = event.target.files[0];
    if (file) {
      const allowedTypes = [
        "image/png",
        "image/webp",
        "image/jpeg",
        "image/jpg",
      ];
      if (allowedTypes.includes(file.type)) {
        if (file.size <= 3 * 1024 * 1024) {
          setSelectedImage(URL.createObjectURL(file));
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.addEventListener("load", () => {
            setImageToUpload(file);
          });
        } else {
          file = null;
          toast.error("Gambar terlalu besar. Maksimum 3MB.");
        }
      } else {
        file = null;
        toast.error("Format gambar tidak diperbolehkan.");
      }
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setIsloading(true);

    const formDataWithImage = new FormData();

    for (const [key, value] of Object.entries(formData)) {
      if (value !== "" && value !== null) {
        formDataWithImage.append(key, value);
        hasValue = true;
      }
    }

    if (selectedImage) {
      formDataWithImage.append("gambar", imageToUpload);
      hasValue = true;
    }

    if (!hasValue) {
      setIsloading(false);
      return toast.error("Masukan data yang ingin diubah.");
    }

    try {
      const response = await fetch(`/api/kedai?id=${params.id}`, {
        method: "PATCH",
        body: formDataWithImage,
      });

      const res = await response.json();

      if (response.ok) {
        setIsloading(false);
        event.target.reset();
        setMenu([]);
        return Promise.resolve(router.push(`/kedai/detail/${params.id}`)).then(
          () => toast.success("Berhasil mengubah kedai!")
        );
      } else {
        setIsloading(false);
        throw new Error(res.error);
      }
    } catch (error) {
      setIsloading(false);
      return toast.error(error.message);
    }
  };

  if (!currentKedaiData) return;

  return (
    <div className="w-fit lg:border lg:shadow-md lg:bg-slate-100 mx-auto lg:my-12 rounded-xl">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 mb-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Ubah data kedai
          </h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex lg:flex-row flex-col lg:gap-8 gap-1 w-full">
            <div className="flex items-center justify-center self-start w-full mx-auto mt-10">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                style={{ width: 250, height: 250 }}
              >
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">
                        Klik untuk mengunggah gambar
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">
                      WEBP, PNG, atau JPG (MAX 3MB)
                    </p>
                  </div>
                )}
                <input
                  id="dropzone-file"
                  type="file"
                  name="gambar"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full">
              <div className="flex flex-row gap-4 justify-center">
                <div className="w-full">
                  <label
                    htmlFor="namaKedai"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Nama Kedai
                  </label>
                  <div className="mt-2">
                    <input
                      id="namaKedai"
                      name="namaKedai"
                      type="text"
                      placeholder={currentKedaiData.namaKedai}
                      onChange={handleInputChange}
                      className="block px-1.5 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="w-full">
                  <label
                    htmlFor="kontak"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Nomor Kontak
                  </label>
                  <div className="mt-2">
                    <input
                      id="kontak"
                      name="kontak"
                      type="number"
                      min="0"
                      autoComplete="phone"
                      placeholder={currentKedaiData.kontak}
                      onChange={handleInputChange}
                      className="px-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="alamat"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Alamat
                  </label>
                </div>
                <div className="mt-2">
                  <textarea
                    rows={4}
                    id="alamat"
                    name="alamat"
                    autoComplete="address"
                    placeholder={currentKedaiData.alamat}
                    onChange={handleInputChange}
                    className="px-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row gap-4">
            <div className="mt-4 w-full">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="hari"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Hari operasional
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="hari"
                  name="hari"
                  type="text"
                  placeholder={currentKedaiData.jadwal[0].hari}
                  onChange={handleInputChange}
                  className="px-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="jamBuka"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Jam buka
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="jamBuka"
                  name="jamBuka"
                  type="text"
                  placeholder={currentKedaiData.jadwal[0].jamBuka}
                  onChange={handleInputChange}
                  className="px-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="jamTutup"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Jam tutup
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="jamTutup"
                  name="jamTutup"
                  type="text"
                  placeholder={currentKedaiData.jadwal[0].jamTutup}
                  onChange={handleInputChange}
                  className="px-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between">
              <label
                htmlFor="deskripsi"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Deskripsi
              </label>
            </div>
            <div className="mt-2">
              <textarea
                id="deskripsi"
                name="deskripsi"
                placeholder={currentKedaiData.deskripsi}
                onChange={handleInputChange}
                className="px-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between">
              <label
                htmlFor="fasilitas"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Fasilitas
                <p className="text-sm font-thin">Pisahkan dengan tanda koma.</p>
              </label>
            </div>
            <div className="mt-2">
              <textarea
                id="fasilitas"
                name="fasilitas"
                placeholder={currentKedaiData.fasilitas}
                className="px-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6"
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="my-2 block text-sm font-medium leading-6 text-gray-900">
            Menu
            <p className="font-thin">
              Isi lalu tekan tombol + untuk menambahkan menu.
            </p>
          </div>
          <div className="grid grid-cols-2 divide-x-2 divide-black gap-4 lg:bg-slate-200 bg-gray-200 p-4 rounded-lg">
            <div className="flex flex-col gap-2 w-full">
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="makanan"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Makanan
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="makanan"
                    name="makanan"
                    type="text"
                    value={makanan}
                    onChange={(e) => setMakanan(e.target.value)}
                    className="px-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="harga"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Harga
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="harga"
                    name="harga"
                    type="number"
                    min="0"
                    value={harga}
                    onChange={(e) => setHarga(e.target.value)}
                    className="px-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="mx-auto flex flex-row gap-2">
                <div className="w-fit">
                  <button
                    type="button"
                    onClick={addMenu}
                    className="flex justify-center w-full rounded-md bg-[#F59E0B] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                  >
                    <span className="font-bold w-fit text-xl text-gray-700">
                      +
                    </span>
                  </button>
                </div>

                {menu.length > 0 && (
                  <div className="w-fit">
                    <button
                      type="button"
                      onClick={clearMenu}
                      className="flex justify-center w-full rounded-md bg-gray-300 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900 shadow-sm hover:bg-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                    >
                      <span className="font-bold w-fit text-xl text-gray-700">
                        <FontAwesomeIcon icon={faTrashCan} />
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 w-fit mx-auto px-2">
              <ul>
                {menu.map((item, index) => (
                  <li key={index} className="grid grid-cols-3 space-y-1">
                    <span className="text-center col-span-2">{`${item.makanan}: ${item.harga}`}</span>
                    <button
                      type="button"
                      onClick={() => deleteMenuItem(index)}
                      className="ml-2 justify-self-end"
                    >
                      <span className="text-lg font-bold text-red-500">
                        <FontAwesomeIcon icon={faMinusSquare} />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 mx-auto w-[300px] grid grid-cols-2 gap-8">
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-md disabled:bg-gray-400 bg-[#F59E0B] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
            >
              {isLoading && (
                <Image
                  src="/spinner.gif"
                  alt="loading"
                  width={20}
                  height={20}
                />
              )}
              {!isLoading && "Simpan"}
            </button>
            <Link href={`/kedai/detail/${params.id}`}>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-md disabled:bg-gray-400 bg-blue-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              >
                Kembali ke kedai
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
