import React from "react";

import { Avatar, Card, CardBody } from "@windmill/react-ui";
import { numberWithCommas, parseDate } from "../../../Helpers/uitils";

import { FaMapMarkerAlt, FaShoppingCart, FaTruckLoading } from "react-icons/fa";

const ViewOrderDetails = ({ order }) => {
  return (
    <div className="">
      <div className="mb-2">
        <h1 className="text-xl font-medium text-center uppercase">
          Order Information
        </h1>
      </div>

      <div className="text-center">
        <p className="text-md mb-2 text-gray-600 tex">
          Order ID :{" "}
          <span className="font-medium text-teal-800">{order.order_ID}</span>
        </p>
        <p className="mb-8 font-medium text-gray-500">{parseDate(order.cat)}</p>
      </div>

      <div className="px-2 rounded py-4 max-h-xl overflow-y-scroll">
        
        <div className="bg-teal-700 mx-3 mb-4 filter border transition duration-500 border-gray-100 hover:border-teal-300 p-5 rounded-md shadow-lg">
          <div className="flex items-center space-x-3 my-2">
            <div className=" rounded-full">
              <FaTruckLoading className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-lg font-medium text-white">
              Chosen Courier :{" "}
              <span className="font-bold italic">
                {order.order_detailed_version.courier.courier_name}
              </span>
            </h1>
            
          </div>
          <div className="flex items-center space-x-2 my-4 text-gray-50">
            <p>
              This order{" "}
              {order.order_detailed_version.order_status === 3
                ? " was "
                : " will be "}{" "}
              delivered by{" "}
              <span className="font-bold italic">
                {order.order_detailed_version.courier.courier_name}
              </span>
            </p>
          </div>
          {order.mode_of_payment === "GCash" ? (
          <div className=" flex items-center justify-start space-x-4">
            <span className="text-white bg-gradient-to-br from-purple-800 to-blue-800 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 ">
              Payed Via <img className="h-8 object-contain" src="https://getpaid.gcash.com/assets/img/logo@3x.png"/>
            </span>
            <p className="font-inter text-white text-sm">
              Reference No:{" "}
              <span className="font-inter font-medium">
                {order.transaction_no}
              </span>
            </p>
          </div>
        ) : (
          <span className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-3">
            Cash On Delivery
          </span>
        )}
        </div>

        <div className="bg-white filter p-5 border transition duration-500 border-gray-100 hover:border-teal-300 rounded-md shadow-lg">
          <h1 className="font-medium text-lg">User Information</h1>
          <div className="flex items-center my-4">
            <Avatar
              className="rounded-xl relative p-2 mr-4 bg-blue-100"
              size="large"
              src={order.user_profile.profile_picture}
            />
            <div>
              <p className="">
                <span className="font-medium">
                  {order.user_profile.user_name}
                </span>
              </p>
              <span className="text-sm text-gray-500 dark:text-white ">
                {order.user_email}
              </span>
            </div>
          </div>
          <h1 className="font-medium mt-6">Contact Number(s)</h1>
          <div>
            {order.user_profile.mobile_numbers.map((number, idx) => (
              <p className="my-1 text-gray-500" key={idx}>
                {number}
              </p>
            ))}
          </div>
        </div>

        <div className="bg-white filter border transition duration-500 border-gray-100 hover:border-teal-300 p-5 rounded-md shadow-lg my-2">
          <div className="flex items-center space-x-3 my-2">
            <div className=" rounded-full animate-pulse">
              <FaMapMarkerAlt className="w-6 h-6 text-teal-700" />
            </div>
            <h1 className="text-lg font-medium">Shipping Address</h1>
          </div>

          <div>
            <p className="text-gray-600 text-lg">
              {order.order_detailed_version.address.address}
            </p>
            <div className="flex space-y-2 text-sm flex-wrap text-gray-600 mt-4">
              <div className=" ">
                <p className="text-sm font-medium">
                  Postal :{" "}
                  <span className="font-mono">
                    {order.order_detailed_version.address.postal}
                  </span>{" "}
                </p>
                <p className="text-sm font-medium">
                  Street :{" "}
                  <span className="font-mono">
                    {order.order_detailed_version.address.street}
                  </span>{" "}
                </p>
                <p className="text-sm font-medium">
                  Barangay :{" "}
                  <span className="font-mono">
                    {order.order_detailed_version.address.barangay}
                  </span>{" "}
                </p>
                <p className="text-sm font-medium">
                  City :{" "}
                  <span className="font-mono">
                    {order.order_detailed_version.address.city}
                  </span>{" "}
                </p>
                <p className="text-sm font-medium">
                  Province :{" "}
                  <span className="font-mono">
                    {order.order_detailed_version.address.province}
                  </span>{" "}
                </p>
                <p className="text-sm font-medium">
                  Region :{" "}
                  <span className="font-mono">
                    {order.order_detailed_version.address.region}
                  </span>{" "}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white filter border transition duration-500 border-gray-100 hover:border-teal-300 p-5 rounded-md shadow-lg mt-2 mb-4">
          <div className="flex items-center space-x-3 my-2">
            <div className=" rounded-full">
              <FaShoppingCart className="w-6 h-6 text-teal-600" />
            </div>
            <h1 className="text-lg font-medium">Items</h1>
          </div>
          <div className="my-8">
            {order.order_detailed_version.items.map((item, idx) => (
              <Card key={idx} className="relative flex h-24 my-4 ">
                <img
                  className="object-cover w-1/4"
                  src={item.thumb}
                  aly={item.product_name}
                />
                <CardBody>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-lg text-gray-600">
                        {item.product_name}
                      </p>
                      <p className="text-xs italic text-teal-400">
                        {item.variant}
                      </p>
                      <p className="text-lg font-medium text-teal-700">
                        ₱ {item.variant_price}
                      </p>
                    </div>
                  </div>
                </CardBody>
                <p className="absolute right-10 top-1/3 text-lg font-bold text-teal-600 text-right">
                  x{item.qty}
                </p>
              </Card>
            ))}
          </div>

          <hr className="border-pink-300" />

          <div className="flex text-xl justify-between items-center mt-4">
            <p className="text-teal-800">Total Cost</p>
            <p className="text-pink-700">
              ₱ {numberWithCommas(order.total_cost, 2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOrderDetails;
