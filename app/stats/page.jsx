"use client";
import React, { useCallback, useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import NextTopLoader from "nextjs-toploader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const { data: session } = useSession();

  const [dropdown, setDropdown] = useState(false);
  const [imgurl, setImgUrl] = useState(null);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);

  const openDropdown = useCallback(() => {
    setDropdown((prevState) => !prevState);
  }, []);

  const data = [
    {
      originalUrl: "https://example.com/very-long-url-that-needs-shortening",
      shortUrl: "https://short.url/abc123",
      created: "2024-03-16",
    },
    {
      originalUrl: "https://another-example.com/another-long-url",
      shortUrl: "https://short.url/def456",
      created: "2024-03-15",
    },
    {
      originalUrl: "https://another-example.com/another-long-url",
      shortUrl: "https://short.url/def456",
      created: "2024-03-15",
    },
    {
      originalUrl: "https://another-example.com/another-long-url",
      shortUrl: "https://short.url/def456",
      created: "2024-03-15",
    },
    {
      originalUrl: "https://another-example.com/another-long-url",
      shortUrl: "https://short.url/def456",
      created: "2024-03-15",
    },
    {
      originalUrl: "https://another-example.com/another-long-url",
      shortUrl: "https://short.url/def456",
      created: "2024-03-15",
    },
    {
      originalUrl: "https://another-example.com/another-long-url",
      shortUrl: "https://short.url/def456",
      created: "2024-03-15",
    },
    // Add more data as needed
  ];
  useEffect(() => {
    if (session && session.user && session.user.image) {
      setEmail(session.user.email);
      setImgUrl(session.user.image);
      setName(session.user.name);
    }
  }, [session]);

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
                className="absolute top-full right-0 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
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
                      onClick={() => signOut()}
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
                  href="#"
                  className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                  aria-current="page"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/stats"
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Stats
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Container under navbar */}
      <div className="flex justify-center mt-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-6">
          Links
        </button>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mx-2">
          QR Code
        </button>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto mt-10 m-10 rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 font-extrabold py-3 text-left text-md text-gray-500 uppercase tracking-wider"
              >
                Original URL
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-md font-bold text-gray-500 uppercase tracking-wider"
              >
                Short URL
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-md font-bold text-gray-500 uppercase tracking-wider"
              >
                Created
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-md font-bold text-gray-500 uppercase tracking-wider"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody className=" bg-gray-500 divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.originalUrl}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{item.shortUrl}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.created}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2">
                    Copy
                  </button>
                  <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-2">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
