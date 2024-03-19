"use client";
import { useState } from "react";

export default function ForgotPassword() {
  const [password, setPassword] = useState(null);
  const [showEmailForm, setShowEmailForm] = useState(true);
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [showCNFForm, setShowCNFForm] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  const handleSubmitEmailForm = (e) => {
    e.preventDefault();
    setShowEmailForm(false);
    setShowOTPForm(true);
  };

  const handleSubmitOTPForm = (e) => {
    e.preventDefault();
    setShowOTPForm(false);
    setShowCNFForm(true);
  };
  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900 flex items-center justify-center h-screen">
        <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-10 ">
          {showEmailForm && (
            <form
              className="mt-4 space-y-4 lg:mt-5 md:space-y-5"
              id="email-form"
              onSubmit={handleSubmitEmailForm}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block mb-5 text-sm font-semibold text-gray-900 dark:text-white font-sans md:text-xl  "
                >
                  {" "}
                  Enter your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 bg-blue-500"
                >
                  Submit
                </button>
              </div>
            </form>
          )}
          {showOTPForm && (
            <form
              className="max-w-sm mx-auto"
              id="otp-form"
              onSubmit={handleSubmitOTPForm}
            >
              <div className="flex mb-2 space-x-2 rtl:space-x-reverse ml-20">
                <div>
                  <label htmlFor="code-1" className="sr-only">
                    First code
                  </label>
                  <input
                    type="text"
                    maxLength="1"
                    data-focus-input-init
                    data-focus-input-next="code-2"
                    id="code-1"
                    className="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="code-2" className="sr-only">
                    Second code
                  </label>
                  <input
                    type="text"
                    maxLength="1"
                    data-focus-input-init
                    data-focus-input-prev="code-1"
                    data-focus-input-next="code-3"
                    id="code-2"
                    className="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="code-3" className="sr-only">
                    Third code
                  </label>
                  <input
                    type="text"
                    maxLength="1"
                    data-focus-input-init
                    data-focus-input-prev="code-2"
                    data-focus-input-next="code-4"
                    id="code-3"
                    className="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="code-4" className="sr-only">
                    Fourth code
                  </label>
                  <input
                    type="text"
                    maxLength="1"
                    data-focus-input-init
                    data-focus-input-prev="code-3"
                    data-focus-input-next="code-5"
                    id="code-4"
                    className="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    required
                  />
                </div>
              </div>
              <p
                id="helper-text-explanation"
                className="mt-2 text-sm text-gray-500 dark:text-gray-400"
              >
                Please introduce the 4 digit code we sent via email.
              </p>
              <button
                type="submit"
                className="ml-32 mt-5 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 hover:bg-blue-800 bg-blue-500"
              >
                Submit
              </button>
            </form>
          )}
          {showCNFForm && (
            <form
              className="mt-4 space-y-4 lg:mt-5 md:space-y-5"
              id="cnf-pass"
              action="#"
            >
              <div className="relative">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  New Password
                </label>
                <div className="flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="new password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    stroke="#bbb"
                    className="fixed w-[18px] h-[18px] cursor-pointer"
                    viewBox="0 0 128 128"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ marginLeft: "340px" }}
                  >
                    <path
                      d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                      data-original="#000000"
                    ></path>
                  </svg>
                </div>
              </div>

              <div className="relative">
                <label
                  htmlFor="confirm-password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Confirm password
                </label>
                <div className="flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirm-password"
                    id="confirm-password"
                    placeholder="Confirm password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    stroke="#bbb"
                    className="absolute flex  w-[18px] h-[18px] cursor-pointer"
                    viewBox="0 0 128 128"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ marginLeft: "340px" }}
                  >
                    <path
                      d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                      data-original="#000000"
                    ></path>
                  </svg>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="newsletter"
                    aria-describedby="newsletter"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="newsletter"
                    className="font-light text-gray-500 dark:text-gray-300"
                  >
                    I accept the{" "}
                    <a
                      className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                      href="#"
                    >
                      Terms and Conditions
                    </a>
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 bg-blue-500"
              >
                Reset password
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
