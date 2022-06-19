import React, { useEffect, useState } from "react";

import { Avatar, Card, CardBody, Button } from "@windmill/react-ui";
import { numberWithCommas, parseDate } from "../Helpers/uitils";

import { FaMapMarkerAlt, FaShoppingCart, FaTruckLoading } from "react-icons/fa";

import FullPageLoader from "./FullPageLoader";
import API from "../Helpers/api";
import { getAuth } from "../Helpers/uitils"
import { useHistory } from "react-router-dom";

const ViewOrderDetails = ({ order_ID }) => {
  const history = useHistory()
  const [order, setOrder] = useState();
  const [loadingData, setLoadingData] = useState(true);

  const loadSomething = async () => {
    try {
      const response = await API.post("/user/orderDetails", { order_ID , auth : getAuth()});
      setOrder(response.data.details);
      console.log(response.data);
      setLoadingData(false);
    } catch (e) {}
  };

  useEffect(() => {
    loadSomething();
  }, []);

  

  return loadingData ? (
    <FullPageLoader />
  ) : (
    <div className="">
      <div className="mb-2">
        <h1 className="text-xl font-medium text-center uppercase">
          Order Information
        </h1>
      </div>

      <div className="text-center">
        <p className="text-md mb-2 text-gray-600 tex">
          Order ID :{" "}
          <span className="font-medium text-teal-800">{order._id}</span>
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
                {order.courier.courier_name}
              </span>
            </h1>
          </div>
          <div className="flex items-center space-x-2 my-4 text-gray-50">
            <p>
              This order {order.order_status === 3 ? " was " : " will be "}{" "}
              delivered by{" "}
              <span className="font-bold italic">
                {order.courier.courier_name}
              </span>
            </p>
          </div>
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
            <p className="text-gray-600 text-lg">{order.address.address}</p>
            <div className="flex space-y-2 text-sm flex-wrap text-gray-600 mt-4">
              <div className=" ">
                <p className="text-sm font-medium">
                  Postal :{" "}
                  <span className="font-mono">{order.address.postal}</span>{" "}
                </p>
                <p className="text-sm font-medium">
                  Street :{" "}
                  <span className="font-mono">{order.address.street}</span>{" "}
                </p>
                <p className="text-sm font-medium">
                  Barangay :{" "}
                  <span className="font-mono">{order.address.barangay}</span>{" "}
                </p>
                <p className="text-sm font-medium">
                  City : <span className="font-mono">{order.address.city}</span>{" "}
                </p>
                <p className="text-sm font-medium">
                  Province :{" "}
                  <span className="font-mono">{order.address.province}</span>{" "}
                </p>
                <p className="text-sm font-medium">
                  Region :{" "}
                  <span className="font-mono">{order.address.region}</span>{" "}
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
            {order.items.map((item, idx) => (
              <Card key={idx} onClick={()=>history.push(`/productdetail/${item.product_ID}`)} className="cursor-pointer relative flex h-24 my-4 ">
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
