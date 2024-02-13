"use client";

import * as React from "react";
import PageLayout from "@/components/PageLayout/Layout";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function EditProfile({ params }: { params: { id: string } }) {
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [imageToUpload, setImageToUpload] = React.useState(null);
  const [isLoading, setIsloading] = React.useState(false);
  const [userData, setUserData] = React.useState(null);
  const [formData, setFormData] = React.useState({
    nama: "",
    email: "",
    bio: "",
  });

  const router = useRouter();
  const { data } = useSession();

  let hasValue = false;

  if (+params.id !== +data?.user?.id) return router.push("/404");

  React.useEffect(() => {
    const getUserData = async () => {
      const { id } = params;

      try {
        const user = await fetch(`/api/user?id=${id}`, {
          method: "GET",
        });

        if (!user.ok) {
          return router.push("/profile/not-found");
        }

        const res = await user.json();
        return setUserData(res);
      } catch (error: any) {
        return toast.error(error.message);
      }
    };

    getUserData();
  }, [params]);

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
          hasValue = true;
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

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
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
      formDataWithImage.append("fotoProfil", imageToUpload);
      hasValue = true;
    }

    if (!hasValue) {
      setIsloading(false);
      return toast.error("Isi data yang ingin diubah.");
    }

    try {
      const response = await fetch("/api/user", {
        method: "PATCH",
        body: formDataWithImage,
      });

      const res = await response.json();

      if (response.ok) {
        setIsloading(false);
        return Promise.resolve(
          router.push(`/profile/view/${userData?.user?.id}`)
        ).then(() => toast.success(res.success));
      } else {
        setIsloading(false);
        throw new Error(res.error);
      }
    } catch (error) {
      setIsloading(false);
      return toast.error(error.message);
    }
  };

  return (
    <PageLayout>
      <div className="w-fit lg:border lg:shadow-md lg:bg-slate-100 mx-auto lg:my-12 rounded-xl">
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 mb-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Ubah data profil
            </h2>
            <p className="font-thin text-center text-sm">
              Setelah mengubah profil dianjurkan untuk melakukan login ulang.
            </p>
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
                          Klik untuk mengunggah foto profil
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
                    accept="image/webp;image/png;image/jpg;image/jpeg"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              <div className="mt-10 sm:mx-auto sm:w-full">
                <div className="flex flex-row gap-4 justify-center">
                  <div className="w-full">
                    <label
                      htmlFor="nama"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Nama
                    </label>
                    <div className="mt-2">
                      <input
                        id="nama"
                        name="nama"
                        autoComplete="name"
                        type="text"
                        placeholder={userData?.user?.nama}
                        className="block px-1.5 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="w-full">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Email
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder={userData?.user?.email}
                        className="px-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="bio"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Bio
                    </label>
                  </div>
                  <div className="mt-2">
                    <textarea
                      rows={4}
                      id="bio"
                      name="bio"
                      autoComplete="bio"
                      placeholder={userData?.user?.bio}
                      className="px-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 mx-auto w-[300px]">
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
            </div>
          </form>
        </div>
      </div>
    </PageLayout>
  );
}
