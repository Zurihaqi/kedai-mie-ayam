"use client";

import * as React from "react";

export default function EditKedai() {
  const [selectedImage, setSelectedImage] = React.useState(null);

  const handleImageChange = (event: any) => {
    const file = event.target.files[0];
    if (file) setSelectedImage(URL.createObjectURL(file));
  };

  return (
    <div className="w-fit lg:border lg:shadow-md lg:bg-slate-100 mx-auto lg:my-12 rounded-xl">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 mb-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Ubah data kedai anda
          </h2>
        </div>
        <form action="#" method="POST">
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
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full">
              <div className="flex flex-row gap-4 justify-center">
                <div className="w-full">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Nama Kedai
                  </label>
                  <div className="mt-2">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="block px-1.5 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="w-full">
                  <label
                    htmlFor="phone-number"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Nomor Kontak
                  </label>
                  <div className="mt-2">
                    <input
                      id="phone-number"
                      name="phone-number"
                      type="text"
                      autoComplete="phone-number"
                      required
                      className="px-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Alamat
                  </label>
                </div>
                <div className="mt-2">
                  <textarea
                    rows={4}
                    id="address"
                    name="address"
                    autoComplete="address"
                    required
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
                  htmlFor="open-days"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Hari operasional
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="open-days"
                  name="open-days"
                  type="text"
                  autoComplete="open-days"
                  required
                  className="px-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="open-hours"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Jam buka
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="open-hours"
                  name="open-hours"
                  type="text"
                  autoComplete="open-hours"
                  required
                  className="px-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="closing-hours"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Jam tutup
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="closing-hours"
                  name="closing-hours"
                  type="text"
                  autoComplete="closing-hours"
                  required
                  className="px-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between">
              <label
                htmlFor="description"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Deskripsi
              </label>
            </div>
            <div className="mt-2">
              <textarea
                id="description"
                name="description"
                autoComplete="description"
                required
                className="px-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between">
              <label
                htmlFor="facility"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Fasilitas
                <p className="text-sm font-thin">
                  Pisahkan dengan tanda koma. (cth: Lesehan, Free Wifi, dst)
                </p>
              </label>
            </div>
            <div className="mt-2">
              <textarea
                id="facility"
                name="facility"
                autoComplete="facility"
                required
                className="px-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between">
              <label
                htmlFor="menu"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Menu
                <p className="text-sm font-thin">
                  Pisahkan dengan tanda koma. (cth: Bakmie, Bakso, dst)
                </p>
              </label>
            </div>
            <div className="mt-2">
              <textarea
                id="menu"
                name="menu"
                autoComplete="menu"
                required
                className="px-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="mt-8 mx-auto w-[300px]">
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-[#F59E0B] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
