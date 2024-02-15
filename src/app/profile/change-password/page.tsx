"use client";

import * as React from "react";
import Image from "next/image";
import toast from "react-hot-toast";

export default function ChangePassword() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [formValues, setFormValues] = React.useState({
    newPassword: "",
    currentPassword: "",
    passwordConfirm: "",
  });

  const onChange = (e: any) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    if (formValues.newPassword !== formValues.passwordConfirm) {
      setIsLoading(false);
      toast.error("Kata sandi tidak sama.");
      return;
    }

    try {
      const response = await fetch("/api/change-password", {
        method: "POST",
        body: JSON.stringify(formValues),
      });

      const res = await response.json();

      if (response.ok) {
        setIsLoading(false);
        toast.success(res.success);
        return setFormValues({
          newPassword: "",
          currentPassword: "",
          passwordConfirm: "",
        });
      } else {
        throw new Error(res.error);
      }
    } catch (error) {
      setIsLoading(false);
      return toast.error(error.message);
    }
  };

  return (
    <div className="lg:w-[400px] w-fit lg:border lg:shadow-md lg:bg-slate-100 mx-auto mt-12 rounded-xl">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 mb-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Ubah kata sandi
          </h2>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={onSubmit}>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              className="hidden"
            />

            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Kata Sandi Lama
              </label>
              <div className="mt-2">
                <input
                  onChange={onChange}
                  value={formValues.currentPassword}
                  id="currentPassword"
                  name="currentPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="currentPassword"
                  required
                  className="px-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Kata Sandi Baru
                </label>
              </div>
              <div className="mt-2">
                <input
                  onChange={onChange}
                  value={formValues.newPassword}
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="newPassword"
                  required
                  className="px-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="passwordConfirm"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Konfirmasi Kata Sandi Baru
                </label>
              </div>
              <div className="mt-2">
                <input
                  onChange={onChange}
                  value={formValues.passwordConfirm}
                  id="passwordConfirm"
                  name="passwordConfirm"
                  type={showPassword ? "text" : "password"}
                  autoComplete="passwordConfirm"
                  required
                  className="px-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <input
              className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s]"
              type="checkbox"
              role="switch"
              id="flexSwitchCheckDefault"
              onClick={togglePasswordVisibility}
            />
            <label
              className="inline-block pl-[0.15rem] hover:cursor-pointer"
              htmlFor="flexSwitchCheckDefault"
            >
              Tampilkan kata sandi
            </label>

            <div>
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
    </div>
  );
}
