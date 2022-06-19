import React from "react";

import { getUrl } from "../Helpers/uitils"
import { Link } from "react-router-dom"

import { RiFacebookFill } from "react-icons/ri"

const Footer = () => {

  return (
    <footer className="px-4 divide-y bg-gray-50 dark:bg-coolGray-800 dark:text-coolGray-100">
      <div className="defTextCol container flex flex-col justify-between py-10 mx-auto space-y-8 lg:flex-row lg:space-y-0">
        <div className="lg:w-1/3">
          <a
            rel="noopener noreferrer"
            href="#"
            className="flex justify-center items-center space-x-3 lg:justify-start"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full dark:bg-violet-400">
              <img class="object-cover rounded-full ring-8 ring-pink-50" src={getUrl('/static/assets/logo.jpg')} alt="" />
            </div>
            <a
              className=" font-inter lg:block ml-6 text-3xl text-gray-800 dark:text-gray-200"
              href="/"
            >
              Astig03
            </a>
          </a>
        </div>
        <div className="grid grid-cols-2 text-sm gap-x-3 gap-y-8 lg:w-2/3 sm:grid-cols-4">
          <div className="space-y-3">
            <h3 className="tracking-wide text-gray-800 uppercase dark:text-coolGray-50">
              Navigation
            </h3>
            <ul className="space-y-1">
              <li>
                <Link to="/">
                  Home
                </Link>
              </li>
              <li>
              <Link to="/products">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/faqs">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/about">
                  About
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="tracking-wide  text-gray-800  uppercase dark:text-coolGray-50">
              Company
            </h3>
            <ul className="space-y-1">
              <li>
                <Link to="/about">
                  About
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <div className="uppercase  text-gray-800  dark:text-coolGray-50">Social media</div>
            <div className="flex justify-start space-x-3">
              <a
                className="ml-3 text-gray-500"
                href="https://www.facebook.com/Astig03-General-Merchandise-1908583755853358/"
                target="_blank"
              >
                <RiFacebookFill className="text-blue-600 h-5 w-5"/>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="defTextCol2 py-6 text-sm text-center dark:text-coolGray-400">
        © 2016 Loft16. All rights reserved.
      </div>
    </footer>

    // <footer className="text-gray-600 body-font">

    // </footer>
  );
};

export default Footer;
