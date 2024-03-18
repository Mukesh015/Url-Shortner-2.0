"use client";
import { useCallback, useState, useEffect } from "react";
import { signIn, useSession, signOut } from "next-auth/react";
import { toast, ToastContainer } from "react-toastify";
import NextTopLoader from "nextjs-toploader";

export default function Home() {
  const { data: session } = useSession();
  const [dropdown, setDropdown] = useState(false);
  const [generate, setGenerate] = useState(false);
  const [copied, setCopied] = useState(false);

  const [imgurl, setImgUrl] = useState(null);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);

  const openDropdown = useCallback(() => {
    setDropdown((prevState) => !prevState);
  }, []);

  const toggleCopy = () => {
    const copyButton = document.getElementById("default-message");
    const copiedButton = document.getElementById("success-message");
    copyButton.classList.add("hidden");
    copiedButton.classList.remove("hidden");
    setCopied(true);
    setTimeout(() => {
      copyButton.classList.remove("hidden");
      copiedButton.classList.add("hidden");
      setCopied(false);
    }, 3000);
  };

  const toggleModal = () => {
    const modal = document.getElementById("authentication-modal");
    modal.classList.toggle("hidden");
    modal.setAttribute(
      "aria-hidden",
      modal.classList.contains("hidden") ? "true" : "false"
    );
  };

  const closeModal = () => {
    const modal = document.getElementById("authentication-modal");
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
  };

  useEffect(() => {
    if (session && session.user && session.user.image) {
      setEmail(session.user.email);
      setImgUrl(session.user.image);
      setName(session.user.name);
    } else {
      toggleModal();
    }
  }, [session]);

  return (
    <>
      <ToastContainer />
      <NextTopLoader />
      {/* Main modal */}
      <div
        id="authentication-modal"
        tabIndex="-1"
        aria-hidden="true"
        className="hidden overflow-y-auto overflow-x-hidden fixed z-20 bg-transparent justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div className="p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Sign in to our platform
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="authentication-modal"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/* Modal body */}
            <div className="p-4 md:p-5">
              <form className="space-y-4" action="#">
                <button
                  onClick={() => {
                    signIn("google");
                  }}
                  type="button"
                  className="text-white w-full bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 me-2 mb-2"
                >
                  <svg
                    className="w-4 h-4 me-2 mr-20"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 18 19"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Sign in with Google
                </button>
                <button
                  onClick={() => {
                    signIn("github");
                  }}
                  type="button"
                  className="text-white w-full bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 me-2 mb-2"
                >
                  <svg
                    className="w-4 h-4 me-2 mr-20"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Sign in with Github
                </button>
                <div className="">
                  <p className="text-center">or</p>
                  <div className="flex">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-300">
                      Custom login ?
                    </p>
                    <a
                      href="/login"
                      className="text-sm font-medium ml-2 text-blue-700 hover:underline dark:text-blue-500"
                    >
                      Login
                    </a>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                  Not registered ?{" "}
                  <a
                    href="/signup"
                    className="text-blue-700 hover:underline dark:text-blue-500"
                  >
                    Create account
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
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
      <div className="mt-10 justify-center ml-96">
        <form className="max-w-3xl">
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
              >
                <path d="M440-280H280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h160v80H280q-50 0-85 35t-35 85q0 50 35 85t85 35h160v80ZM320-440v-80h320v80H320Zm200 160v-80h160q50 0 85-35t35-85q0-50-35-85t-85-35H520v-80h160q83 0 141.5 58.5T880-480q0 83-58.5 141.5T680-280H520Z" />
              </svg>
            </div>
            <div className="flex">
              <input
                type="search"
                id="default-search"
                className="block w-full p-4 ps-10 mr-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Paste a link here..."
                required
              />
              <button
                type="button"
                className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 w-28"
              >
                Generate
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="border rounded-md flex max-w-3xl mt-16 ml-96 min-h-40 max-h-80 bg-slate-700">
        <p className="p-3 text-gray-300">
          https://github/facebook/react/blob/master
        </p>
        <button className="mt-2 text-gray-900 h-fit dark:text-gray-400 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 rounded-lg py-2 px-2.5 inline-flex items-center justify-center bg-white border-gray-200 border">
          <span
            onClick={toggleCopy}
            id="default-message"
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
            id="success-message"
            className={
              !copied ? "hidden items-center" : "inline-flex items-center"
            }
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
      </div>
      <div className="flex mt-40 items-center justify-center">
        <div className="mr-10">
          <img
            className="h-20 ml-16 rounded-full"
            src="https://png.pngtree.com/png-clipart/20210309/original/pngtree-thumbs-up-icon-png-image_5820943.jpg"
            alt="Statistics Icon"
          />
          <h3 className="font-bold pl-20">Easy</h3>
          <p className="text-slate-500"> ShortURL is easy and fast,</p>
        </div>
        <div className="mr-10">
          <img
            className="h-20 ml-20 rounded-full"
            src="https://static.vecteezy.com/system/resources/previews/010/737/931/non_2x/broken-chain-icon-eps-10-free-vector.jpg"
            alt="Statistics Icon"
          />
          <h3 className="font-bold pl-20">Shortened</h3>
          <p className="text-slate-500">Use any link, no matter what size</p>
        </div>
        <div>
          <img
            className="h-20 ml-8 rounded-full"
            src="https://png.pngtree.com/png-clipart/20191122/original/pngtree-shield-safe-line-icon-vector-png-image_5175136.jpg"
            alt="Statistics Icon"
          />
          <h3 className="font-bold pl-10">Secure</h3>
          <p className="text-slate-500">It is fast,secure and </p>
        </div>
      </div>
      <div className="flex mt-20 items-center justify-center">
        <div className="mr-10">
          <img
            className="h-20 ml-16 rounded-full"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyGnUa_zixC3zGRhy4I1wRk0fDsRnfv3GEtg&usqp=CAU"
            alt="Statistics Icon"
          />
          <h3 className="font-bold pl-16">Statistics</h3>
          <p className="text-slate-500">Check the clicks of received</p>
          <p className="pl-10 text-slate-500"> shortened URL </p>
        </div>
        <div className="mr-10">
          <img
            className="h-20 ml-28 rounded-full"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOTyE3OFA-N4n8MhAMrCRszqPHR-nWZ9nKxw&usqp=CAU"
            alt="Statistics Icon"
          />
          <h3 className="font-bold pl-28">Reliable</h3>
          <p className="text-slate-500">links that try to disseminate spam</p>
          <p className="pl-5"></p>
        </div>
        <div>
          <img
            className="h-20 ml-10 rounded-full"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTahvC_1iXzH4ZmxuU5GMTJDpvOum4pBpHwzw&usqp=CAU"
            alt="Statistics Icon"
          />
          <h3 className="font-bold pl-10">Devices</h3>
          <p className="text-slate-500">Compatible with Devices</p>
          {/* <p className="pl-10">tablets and desktop</p> */}
        </div>
      </div>
      <footer className="bg-white rounded-lg mt-40 shadow dark:bg-gray-900 ">
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
                URL Shortner
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
            © 2023{" "}
            <a href="https://flowbite.com/" className="hover:underline">
              Flowbite™
            </a>
            . All Rights Reserved.
          </span>
        </div>
      </footer>
    </>
  );
}
