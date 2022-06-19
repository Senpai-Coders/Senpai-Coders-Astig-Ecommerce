import React, { useEffect } from "react";

import { ImQuotesLeft, ImQuotesRight } from "react-icons/im";
import { motion } from "framer-motion";
import { getUrl } from "../../Helpers/uitils";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className=" bg-gray-50 mb-64 pb-24">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.75 }}
        className="flex justify-center h-1/2 items-center"
      >
        <p className="text-5xl text-center mx-8 md:mx-4 NotoSerif text-teal-700 mt-14">
          Who we are and why we do what we do!
        </p>
      </motion.section>
      <motion.section
        className="mx-8 sm:mx-24 md:w-1/2 md:mx-auto mt-14 mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1.75 }}
      >
        <div className="relative h-14">
          <ImQuotesLeft className="absolute top-2 left-0 h-9 w-9 text-pink-700" />
        </div>
        <p
          style={{ textIndent: "5%" }}
          className="leading-10 indent-10 text-justify text-teal-700"
        >
          We Astig03 General Merchandise offer latest trends, unique and stylish
          products from our store to you for a cheaper price. Costumes for your
          kids that gives them a sprinkle of cuteness. Shoes and bags that can
          make your style shine at a cheaper price.
        </p>
        <p
          style={{ textIndent: "5%" }}
          className="leading-10 indent-10 text-justify text-teal-800"
        >
          Join Astig03 to find everything you need at the best prices. Buy the
          products you want in a worry-free manner. Refer to shop ratings and
          reviews to find trusted review from other shoppers.
        </p>
        <div className="relative">
          <ImQuotesRight className="absolute right-28 -bottom-8 h-9 w-9 text-pink-700" />
        </div>
      </motion.section>
      <div className="hidden space-x-24 md:flex justify-center items-center w-full">
        <div className="flex w-1/3 items-center justify-center px-4">
          <div className=" overflow-hidden rounded-xl">
            <div className="">
              <img
                src={getUrl(
                  "/static/assets/76730708_3105299982848390_5582876298415439872_n.jpg"
                )}
                alt="plant"
                className="object-cover h-48 w-full rounded-xl"
              />
            </div>
            <div className="p-5">
              <p className="font-inter font-semibold">
                Dragon 8 Mall Divisoria Second floor 2f-12 C.M Recto cor.
                Dagupan st., Divisoria, Manila
              </p>
              <hr className="my-3"></hr>
              <p className="font-inter mb-3">
                <span className=" font-semibold">Opening Hours : </span> 7 AM to
                8 PM
              </p>
              <p className="font-inter mb-3">
                <span className=" font-semibold">Open During : </span> [ Monday -
                Saturday ]{" "}
              </p>
              <p className="font-inter text-sm">We are close on Sunday.</p>
            </div>
          </div>
        </div>
        <div className="flex w-1/3 items-center justify-center  px-4">
          <div className="overflow-hidden rounded-xl">
            <div className="">
              <img
                src={getUrl(
                  "/static/assets/272147734_5353166681395031_8513818380821404129_n.jpg"
                )}
                alt="plant"
                className="object-cover rounded-xl h-48 w-full"
              />
            </div>
            <div className="p-5">
              <p className="font-inter font-semibold">
                Unit 74 Ground Floor Acienda Designer Outlet Km, 48m Aguinaldo
                Hwy cor. Balubad Rd Brgy, Silang, 4118 Cavite
              </p>
              <hr className="my-3"></hr>
              <p className="font-inter mb-3">
                <span className=" font-semibold">Opening Hours : </span> 10 AM
                to 7 PM
              </p>
              <p className="font-inter mb-3">
                <span className=" font-semibold">Open During : </span> [ Monday
                - Friday ]{" "}
              </p>
              <p className="font-inter text-sm">
                We are close on Saturday and Sunday.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="md:hidden flex mt-32 my-10 mx-4 md:mx-auto sm:w-11/12 md:w-7/12 justify-center">
        <motion.section
          className="grid grid-cols-1 md:grid-cols-2 gap-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1.75 }}
        >
          <div className="flex items-center justify-center px-4">
            <div className=" overflow-hidden rounded-xl">
              <div className="">
                <img
                  src={getUrl(
                    "/static/assets/76730708_3105299982848390_5582876298415439872_n.jpg"
                  )}
                  alt="plant"
                  className="object-cover h-48 w-full rounded-xl"
                />
              </div>
              <div className="p-5">
                <p className="font-inter font-semibold">
                  Dragon 8 Mall Divisoria Second floor 2f-12 C.M Recto cor.
                  Dagupan st., Divisoria, Manila
                </p>
                <hr className="my-3"></hr>
                <p className="font-inter mb-3">
                  <span className=" font-semibold">Opening Hours : </span> 7 AM
                  to 8 PM
                </p>
                <p className="font-inter mb-3">
                  <span className=" font-semibold">Open During : </span> [Monday
                  - Saturday]{" "}
                </p>
                <p className="font-inter text-sm">We are close on Sunday.</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center  px-4">
            <div className="overflow-hidden rounded-xl">
              <div className="">
                <img
                  src={getUrl(
                    "/static/assets/272147734_5353166681395031_8513818380821404129_n.jpg"
                  )}
                  alt="plant"
                  className="object-cover rounded-xl h-48 w-full"
                />
              </div>
              <div className="p-5">
                <p className="font-inter font-semibold">
                  Unit 74 Ground Floor Acienda Designer Outlet Km, 48m Aguinaldo
                  Hwy cor. Balubad Rd Brgy, Silang, 4118 Cavite
                </p>
                <hr className="my-3"></hr>
                <p className="font-inter mb-3">
                  <span className=" font-semibold">Opening Hours : </span> 10 AM
                  to 7 PM
                </p>
                <p className="font-inter mb-3">
                  <span className=" font-semibold">Open During : </span> [
                  Monday - Friday ]{" "}
                </p>
                <p className="font-inter text-sm">
                  We are close on Saturday and Sunday.
                </p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default About;
