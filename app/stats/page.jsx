"use client";
import React, { useCallback, useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import NextTopLoader from "nextjs-toploader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import cookie from "js-cookie";
import Cookies from "js-cookie";

export default function Stats() {
  const { data: session } = useSession();

  const [dropdown, setDropdown] = useState(false);
  const [imgurl, setImgUrl] = useState(null);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [copied, setCopied] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [data, setData] = useState(null);
  const [QRPopup, setQRPopup] = useState(false);
  const [qrcode, setQrcode] = useState(null);
  const [deleteUrl, setDeleteUrl] = useState(null);
  const [downloadQrCode, setdownloadQrCode] = useState(false);

  const handleQrDownload = useCallback((qrcode) => {}, []);

  const openDeletePopup = useCallback((url) => {
    setDeleteUrl(url);
    setDeletePopup((prevState) => !prevState);
  }, []);

  const handleredirect = useCallback((url) => {
    window.open(url, "_blank");
  }, []);

  const openQRPopup = useCallback((qrcode) => {
    setQrcode(qrcode);
    setQRPopup((prevState) => !prevState);
    handleQrDownload(qrcode);
    if (downloadQrCode) {
    }
  }, []);

  const openDropdown = useCallback(() => {
    setDropdown((prevState) => !prevState);
  }, []);

  const logout = async () => {
    Cookies.remove("cookie-1");
    router.push("/");
  };

  const deleteShortUrl = useCallback(async () => {
    console.log(deleteUrl);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/deleteurl/${deleteUrl}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        console.log("Failed to delete url: ", deleteUrl, data);
      } else {
        toast.success("Deleted successfully", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });
        setDeletePopup((prevState) => !prevState);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    } catch (error) {
      console.error("Server", error);
    }
  }, [email, deleteUrl, setDeletePopup]);

  const toggleCopy = (shortId) => {
    navigator.clipboard.writeText(`http://localhost:8010/redirect/${shortId}`);
    const copyButton = document.getElementById(`default-message-${shortId}`);
    const copiedButton = document.getElementById(`success-message-${shortId}`);
    copyButton.classList.add("hidden");
    copiedButton.classList.remove("hidden");
    setTimeout(() => {
      copyButton.classList.remove("hidden");
      copiedButton.classList.add("hidden");
    }, 3000);
  };

  const getUrls = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8010/geturl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        console.log("Fetching failed");
      } else {
        const Data = await response.json();
        setData(Data);
        console.log(data);
      }
    } catch {
      console.log("Fetching failed, server error");
    }
  }, [email]);

  const getDetails = useCallback(async () => {
    try {
      const token = cookie.get("cookie-1");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/decode`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        }
      );
      if (!response.ok) {
        console.error("Cannot get avatar");
      } else {
        const data = await response.json();
        setImgUrl(data.username.avatar);
        setEmail(data.username.email);
        setName(data.username.username);
      }
    } catch (error) {
      console.error("Server", error);
    }
  }, [email, name, imgurl]);

  useEffect(() => {
    if (session && session.user && session.user.image) {
      setEmail(session.user.email);
      setImgUrl(session.user.image);
      setName(session.user.name);
    }
  }, [session]);

  useEffect(() => {
    getDetails();
    getUrls();
  }, [getDetails, getUrls]);

  useEffect(() => {
    console.log("Page rerendering...", data);
  }, [data, deleteShortUrl]);

  return (
    <>
      <ToastContainer />
      <NextTopLoader />
      <nav className="bg-white border-gray-200 dark:bg-gray-900 relative">
        {" "}
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img
              src="https://99designs-blog.imgix.net/blog/wp-content/uploads/2022/05/Mastercard_2019_logo.svg-e1659036851269.png?auto=format&q=60&fit=max&w=930"
              className="h-8"
              alt="Flowbite Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              URL Shortner
            </span>
          </a>
          <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse relative">
            {" "}
            <button
              type="button"
              className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              id="user-menu-button"
              aria-expanded="false"
              onClick={openDropdown}
            >
              <span className="sr-only">Open user menu</span>
              <img
                className="w-8 h-8 rounded-full"
                src={imgurl}
                alt="https://e7.pngegg.com/pngimages/136/22/png-clipart-user-profile-computer-icons-girl-customer-avatar-angle-heroes.png"
              />
            </button>
            {/* Dropdown menu */}
            {dropdown && (
              <div
                className="absolute z-10   top-full right-0 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
                id="user-dropdown"
              >
                {" "}
                {/* Adjust top value */}
                <div className="px-4 py-3">
                  <span className="block text-sm text-gray-900 dark:text-white">
                    {name}
                  </span>
                  <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                    {email}
                  </span>
                </div>
                <ul className="py-2" aria-labelledby="user-menu-button">
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => signOut() && logout()}
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >
                      Sign out
                    </a>
                  </li>
                </ul>
              </div>
            )}
            {/* Mobile menu button */}
            <button
              data-collapse-toggle="navbar-user"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-user"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>
          {/* Main menu */}
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-user"
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <a
                  href="/"
                  className="block py-2 px-3 mr-7 text-white  rounded md:bg-transparent md:p-0 md:hover:text-blue-700"
                  aria-current="page"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/stats"
                  className="block py-2 px-3 mr-7 rounded hover:bg-gray-100 md:hover:bg-transparent text-blue-500  md:p-0 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Stats
                </a>
              </li>
              <li>
                <a
                  href="/stats"
                  className="block py-2 px-3 mr-7 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/stats"
                  className="block py-2 px-3 mr-7 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  About
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {deletePopup && (
        <div className="fixed inset-0 p-4  flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]">
          <div className="w-full max-w-md shadow-lg rounded-md p-6 dark:bg-gray-700 relative">
            <svg
              onClick={openDeletePopup}
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 cursor-pointer shrink-0 fill-black hover:fill-red-500 float-right"
              viewBox="0 0 320.591 320.591"
            >
              <path
                d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                data-original="#000000"
              ></path>
              <path
                d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                data-original="#000000"
              ></path>
            </svg>
            <div className="my-8 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 fill-red-500 inline"
                viewBox="0 0 24 24"
              >
                <path
                  d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                  data-original="#000000"
                />
                <path
                  d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                  data-original="#000000"
                />
              </svg>
              <h4 className="text-xl font-semibold mt-6">
                Are you sure you want to delete it?
              </h4>
              <p className="text-sm text-slate-400 mt-4">
                Are you sure want to delete it ? These process is not reversible
              </p>
            </div>
            <div className="flex flex-col space-y-2">
              <button
                onClick={deleteShortUrl}
                type="button"
                className="px-6 py-2.5 rounded-md text-white text-sm font-semibold border-none outline-none bg-red-500 hover:bg-red-600 active:bg-red-500"
              >
                Delete
              </button>
              <button
                onClick={openDeletePopup}
                type="button"
                className="px-6 py-2.5 rounded-md text-black text-sm font-semibold border-none outline-none bg-gray-200 hover:bg-gray-300 active:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {QRPopup && (
        <div className="fixed inset-0 p-4  flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]">
          <div className="w-full max-w-md shadow-lg rounded-md p-6 dark:bg-gray-300  relative">
            <svg
              onClick={openQRPopup}
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 cursor-pointer shrink-0 fill-black hover:fill-red-500 float-right"
              viewBox="0 0 320.591 320.591"
            >
              <path
                d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                data-original="#000000"
              ></path>
              <path
                d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                data-original="#000000"
              ></path>
            </svg>
            <div className="my-8 text-center">
              <img className="h-60 ml-20" src={qrcode} alt="Qr Code" />
            </div>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => setdownloadQrCode(true)}
                type="button"
                className="px-6 py-2.5 rounded-md text-black text-sm font-semibold border-none outline-none bg-gray-200 hover:bg-green-500 hover:text-white active:bg-gray-200"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative m-5 overflow-x-auto shadow-md sm:rounded-lg mt-10">
        <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
          <div>
            <button
              id="dropdownRadioButton"
              data-dropdown-toggle="dropdownRadio"
              className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              type="button"
            >
              <svg
                className="w-3 h-3 text-gray-500 dark:text-gray-400 me-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
              </svg>
              Last 30 days
              <svg
                className="w-2.5 h-2.5 ms-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>
            {/* Dropdown menu */}
            <div
              id="dropdownRadio"
              className="z-10 hidden w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
              data-popper-reference-hidden=""
              data-popper-escaped=""
              data-popper-placement="top"
              style={{
                position: "absolute",
                inset: "auto auto 0px 0px",
                margin: "0px",
                transform: "translate3d(522.5px, 3847.5px, 0px)",
              }}
            >
              <ul
                className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownRadioButton"
              >
                <li>
                  <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                    <input
                      id="filter-radio-example-1"
                      type="radio"
                      value=""
                      name="filter-radio"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="filter-radio-example-1"
                      className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                    >
                      Last day
                    </label>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <input
              type="text"
              id="table-search"
              className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search for items"
            />
          </div>
        </div>
        {data ? (
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Original URL
                </th>
                <th scope="col" className="px-6 py-3">
                  Short URL
                </th>
                <th scope="col" className="px-6 py-3">
                  QR Code
                </th>
                <th scope="col" className="px-6 py-3">
                  Created At
                </th>
                <th scope="col" className="px-6 py-3">
                  Clicks
                </th>
                <th scope="col" className="px-20 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data.shortId.map((shortId, index) => (
                <tr
                  key={shortId}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <td className="px-4 py-4">
                    <div className="flex">
                      <p className="mt-2">{data.redirectURL[index]}</p>
                      <svg
                        onClick={() =>
                          handleredirect(`${data.redirectURL[index]}`)
                        }
                        className="ml-3 mt-2"
                        xmlns="http://www.w3.org/2000/svg"
                        height="18px"
                        viewBox="0 0 24 24"
                        width="18px"
                        fill="#FFFFFF"
                      >
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                      </svg>
                    </div>
                  </td>
                  <td className="px-6 py-4 flex">
                    <p className="mt-3">
                      {`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/redirect/${shortId}`}
                    </p>
                    <svg
                      onClick={() =>
                        handleredirect(
                          `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/redirect/${shortId}`
                        )
                      }
                      className="ml-3 mt-3"
                      xmlns="http://www.w3.org/2000/svg"
                      height="18px"
                      viewBox="0 0 24 24"
                      width="18px"
                      fill="#FFFFFF"
                    >
                      <path d="M0 0h24v24H0V0z" fill="none" />
                      <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                    </svg>
                  </td>
                  <td className="px-6 py-4">
                    <img
                      onClick={() => openQRPopup(data.qrCodeUrl[index])}
                      src={data.qrCodeUrl[index]}
                      alt={`QR Code for ${shortId}`}
                      className="w-8 h-8"
                    />
                  </td>
                  <td className="px-6 py-4">
                    {data.formattedCreatedAt[index]}
                  </td>
                  <td className="px-6 py-4">{data.shortIdCounts[shortId]}</td>
                  <td className="px-6 py-4">
                    <button
                      className="mt-2 text-gray-900 h-fit dark:text-gray-400 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 rounded-lg py-2 px-2.5 inline-flex items-center justify-center bg-white border-gray-200 border"
                      type="button"
                    >
                      <span
                        onClick={() => toggleCopy(shortId)} // Pass shortId as argument
                        id={`default-message-${shortId}`} // Add shortId to id
                        className="inline-flex items-center"
                      >
                        <svg
                          className="w-3 h-3 me-1.5"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 18 20"
                        >
                          <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                        </svg>
                        <span className="text-xs font-semibold">Copy</span>
                      </span>
                      <span
                        id={`success-message-${shortId}`} // Add shortId to id
                        className={`inline-flex items-center ${
                          !copied ? "hidden" : ""
                        }`} // Check copied state
                      >
                        <svg
                          className="w-3 h-3 text-blue-700 dark:text-blue-500 me-1.5"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 16 12"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M1 5.917 5.724 10.5 15 1.5"
                          />
                        </svg>
                        <span className="text-xs font-semibold text-blue-700 dark:text-blue-500">
                          Copied
                        </span>
                      </span>
                    </button>
                    <button
                      className="mt-2  text-gray-900 h-fit dark:text-gray-400 dark:bg-gray-800 hover:text-white text-xs rounded-lg py-2 px-2.5 inline-flex font-semibold ml-3 items-center justify-center bg-white border-gray-500 border hover:bg-red-500"
                      onClick={() => openDeletePopup(shortId)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 me-1.5"
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-3 text-gray-400">No records found</p>
        )}
      </div>

      <footer className="bg-white rounded-lg mt-96 shadow dark:bg-gray-900 ">
        <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <a
              href="https://flowbite.com/"
              className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
            >
              <img
                src="https://99designs-blog.imgix.net/blog/wp-content/uploads/2022/05/Mastercard_2019_logo.svg-e1659036851269.png?auto=format&q=60&fit=max&w=930  "
                className="h-8"
                alt="Flowbite Logo"
              />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                URL Shortener
              </span>
            </a>
            <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">
                  Licensing
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2024{" "}
            <a href="https://flowbite.com/" className="hover:underline"></a>.
            All Rights Reserved.
          </span>
        </div>
      </footer>
    </>
  );
}
