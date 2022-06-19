import React from "react";
import { useLocation, Link } from "react-router-dom";

/* Icons */
import { BsHourglassSplit } from "react-icons/bs";
import { ImCart } from "react-icons/im";
import { GiAirplaneArrival } from "react-icons/gi";
import { AiOutlineStop } from "react-icons/ai";

const UserNav = () => {
  const curUrl = useLocation().pathname;

  return (
    <div>
      <section className="text-gray-600 body-font">
        <div className="px-5 pt-8 pb-2 mx-auto flex flex-wrap flex-col">
          <div className="flex text-base text-gray-400 mx-auto flex-wrap mb-8">
            <Link
              to="/user/mycart"
              className={
                (curUrl === "/user/mycart" || curUrl === "/user/profile"
                  ? "border-pink-500 text-pink-500 bg-blue-200"
                  : "") +
                "transition duration-300 ease-out cursor-pointer sm:px-6 py-3 w-1/2 sm:w-auto justify-center sm:justify-start border-b-2 title-font font-medium inline-flex items-center leading-none hover:text-blue-400 tracking-wider rounded-t"
              }
            >
              {/* bg-gray-100 border-indigo-500 text-indigo-500 */}
              <ImCart className="w-5 h-5 mr-2" />
              MyCart
            </Link>
            <Link
              to="/user/myorders"
              className={
                (curUrl === "/user/myorders"
                  ? "border-blue-400 text-blue-400 bg-blue-200"
                  : "") +
                "transition duration-300 ease-out cursor-pointer sm:px-6 py-3 w-1/2 sm:w-auto justify-center sm:justify-start border-b-2 title-font font-medium inline-flex items-center leading-none hover:text-blue-400 tracking-wider rounded-t"
              }
            >
              <BsHourglassSplit className="w-5 h-5 mr-2" />
              Orders
            </Link>
            <Link
              to="/user/arrivedorders"
              className={
                (curUrl === "/user/arrivedorders"
                  ? "border-green-500 text-green-500 bg-blue-200"
                  : "") +
                "transition duration-300 ease-out cursor-pointer sm:px-6 py-3 w-1/2 sm:w-auto justify-center sm:justify-start border-b-2 title-font font-medium inline-flex items-center leading-none hover:text-blue-400 tracking-wider rounded-t"
              }
            >
              <GiAirplaneArrival className="w-5 h-5 mr-2" />
              Arrived Orders
            </Link>
            <Link
              to="/user/cancelledorders"
              className={
                (curUrl === "/user/cancelledorders"
                  ? "border-orange-500 text-orange-700 bg-blue-200"
                  : "") +
                "transition duration-300 ease-out cursor-pointer sm:px-6 py-3 w-1/2 sm:w-auto justify-center sm:justify-start border-b-2 title-font font-medium inline-flex items-center leading-none hover:text-blue-400 tracking-wider rounded-t"
              }
            >
              <AiOutlineStop className="w-5 h-5 mr-2" />
              Cancelled
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserNav;
