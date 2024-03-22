"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ForgotPassword() {
  const router = useRouter();

  const [email, setEmail] = useState(null);
  const [cnfPassword, setCnfPassword] = useState(null);
  const [password, setPassword] = useState(null);
  const [showEmailForm, setShowEmailForm] = useState(true);
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [showCNFForm, setShowCNFForm] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [otpDigits, setOtpDigits] = useState("");
  const inputRefs = useRef([]);

  const handleResetPassword = useCallback(async (e) => {
    e.preventDefault();
    if (password === cnfPassword) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/reset`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          }
        );
        if (!response.ok) {
          toast.error("Password reset failed", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        } else {
          toast.success("Password reseted", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          setTimeout(() => {
            router.push("/login");
          }, 1000);
        }
      } catch (error) {
        console.error("Server error", error);
      }
    } else {
      toast.error("Passwords does not matching", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  },[password,cnfPassword]);

  const handleInputChange = (e, index) => {
    const { value } = e.target;
    const newOtpDigits =
      otpDigits.slice(0, index) + value + otpDigits.slice(index + 1);
    setOtpDigits(newOtpDigits);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleSubmitEmailForm = useCallback(async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/createnewotp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      if (!response.ok) {
        toast.error("OTP generation failed", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        toast.success("OTP sent successfully", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        console.log(email);
        setShowEmailForm(false);
        setShowOTPForm(true);
      }
    } catch (error) {
      console.error("Server error", error);
    }
  });

  const validation = useCallback(
    async (otp) => {
      console.log(otp);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/validation`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, otp }),
          }
        );
        if (!response.ok) {
          toast.error("Incorrect OTP or email", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        } else {
          const data = await response.json();
          toast.success("OTP validation success", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          console.log("Create a new password ", data);
          setShowOTPForm(false);
          setShowCNFForm(true);
        }
      } catch (error) {
        console.log("Server error ", error);
      }
    },
    [email]
  );

  const handleSubmitOTPForm = (e) => {
    e.preventDefault();
    const otpNumber = parseInt(otpDigits, 10);
    validation(otpNumber);
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <>
      <ToastContainer />

      <section className="bg-gray-50 dark:bg-gray-900 flex items-center justify-center h-screen">
        <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-10">
          {showEmailForm && (
            <form
              className="mt-4 space-y-4 lg:mt-5 md:space-y-5"
              id="email-form"
              onSubmit={handleSubmitEmailForm}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block mb-5 text-sm font-semibold text-gray-900 dark:text-white font-sans md:text-xl"
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
                  onChange={(e) => setEmail(e.target.value)}
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
                {[1, 2, 3, 4].map((index) => (
                  <div key={index}>
                    <label htmlFor={`code-${index}`} className="sr-only">
                      {`Code ${index}`}
                    </label>
                    <input
                      type="text"
                      maxLength="1"
                      id={`code-${index}`}
                      ref={(el) => (inputRefs.current[index - 1] = el)}
                      className="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      required
                      value={otpDigits[index - 1] || ""}
                      onChange={(e) => handleInputChange(e, index - 1)}
                    />
                  </div>
                ))}
              </div>
              <p
                id="helper-text-explanation"
                className="mt-2 text-sm text-gray-500 dark:text-gray-400"
              >
                Please introduce the 4-digit code we sent via email.
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
              onSubmit={handleResetPassword}
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
                    onChange={(e) => setCnfPassword(e.target.value)}
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
