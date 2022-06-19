import React, { useEffect, useState } from "react";

import { MdOutlineClose } from "react-icons/md";

import Informative from "../../Components/Modal/Informative";
import FullPageLoader from "../../Components/FullPageLoader";
import HelperLabel from "../../Components/HelperLabel";
import API from "../../Helpers/api";
import { getAuth } from "../../Helpers/uitils"

import { Button } from "@windmill/react-ui"

import { useSelector, useDispatch } from "react-redux";
import { signin, signout } from "../../Features/userSlice";
import { openNotifier } from "../../Features/uiSlice";

import { numberWithCommas, parseDate } from "../../Helpers/uitils";

import { openAlertModal, openInputModal } from "../../Features/uiSlice";

import ViewOrderDetails from "../../Components/ViewOrderDetails";

import { motion } from "framer-motion"

import { getUserTickUpdate } from "../../Helpers/uitils"

const Orders = () => {
  const userData = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [unmounted, setUnmounted] = useState(false)

  const loadUserData = async () => {
    let _id = userData._id;
    if (!_id) {
      dispatch(
        openAlertModal({
          component: <Informative />,
          data: {
            description: "Look's Like You Are Not Logged In",
            solution: "Your access has expired, please sign in again!",
          },
        })
      );
      dispatch(signout());
      return;
    }
    try {
      setLoading(true);
      const response = await API.post(`/user/mydetails/${_id}`, { auth : getAuth() });

      if(unmounted) return
      dispatch(signin(response.data.userData));
      setLoading(false);
    } catch (error) {
      if (error.response) {
        dispatch(
          openAlertModal({
            component: <Informative />,
            data: {
              description: error.response.data.description,
              solution: error.response.data.solution,
            },
          })
        );
        return;
      }
      dispatch(
        openAlertModal({
          component: <Informative />,
          data: {
            description: "We can't reach the server",
            solution: "Please try again later",
          },
        })
      );
    }
  };

  const cancelOrder = async (item) => {
    try {
      await API.post("/user/cancelOrder", {
        _id: userData._id,
        order_object: item,
        order_ID: item.order_ID,
        auth : getAuth()
      });

      await loadUserData();
    } catch (err) {
      dispatch(
        openAlertModal({
          component: <Informative />,
          data: {
            description: "Failed",
            solution:
              "Sorry, but the system failed to cancell this order! try again later",
          },
        })
      );
      console.log(err);
    }
  };
  useEffect(()=>{window.scrollTo(0, 0);},[])

  useEffect(() => {
    loadUserData();
    const interval = setInterval(() => {
        loadUserData();
      }, getUserTickUpdate());
  
      return () => {
        clearInterval(interval);
        setUnmounted(true)
      };
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.75 }}>
      {loading ? (
        <FullPageLoader />
      ) : (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.75 }}>
          <p className="text-2xl text-center font-medium">Your Orders</p>

          <section className="text-gray-600 body-font mx-8">
            <div className="mx-auto md:w-2/6 w-1/2 mt-4">
              <HelperLabel
                isError={false}
                msg={
                  "You can cancel an order if it is not yet approved by admin"
                }
              />
            </div>
            <div className="container px-5 py-24 mx-auto">
              <div className="flex flex-wrap -mx-4 -my-8">
                {userData.pending_orders.length === 0 &&
                  userData.in_progress.length === 0 && (
                    <>
                      <div className="w-full">
                        <p className="w-full text-center">You have no orders</p>
                      </div>
                    </>
                  )}

                {userData.in_progress.map((in_progress, idx) => (
                  <div
                    key={idx}
                    
                    class="py-8 px-4 mt-4 sm:w-full lg:w-1/3 relative overflow-hidden border border-gray-100 rounded-lg"
                  >
                    <span class="absolute inset-x-0 bottom-0 h-1  bg-gradient-to-r from-green-300 via-blue-500 to-green-400"></span>

                    <div class="justify-between sm:flex">
                      <div>
                        <h5 class="text-base  text-gray-900">
                          Order ID: {in_progress.order_ID}
                        </h5>
                        <p class="mt-1 text-xs font-medium text-gray-600">
                          Chosen Courier : {in_progress.courier}
                        </p>
                        <p class="mt-1 text-xs font-medium text-gray-600">
                          {" "}
                          Status :{" "}
                          {in_progress.order_status === 1
                            ? "Approved & Processed"
                            : "Shipped"}{" "}
                        </p>
                      </div>
                    </div>

                    <div class="justify-between mt-4 sm:flex">
                      <div>
                        <h5 class="text-xl font-quicksand text-gray-900">
                          Total: ₱{" "}
                          <span className="font-medium">
                            {numberWithCommas(in_progress.total_cost)}
                          </span>
                        </h5>
                      </div>
                    </div>

                    <div class="mt-4 sm:pr-8">
                      <p
                        class={`text-sm ${
                          in_progress.order_status === 1
                            ? "text-blue-500"
                            : "text-teal-500"
                        }`}
                      >
                        {in_progress.order_status === 1
                          ? `Your order was approved and processed. Your package is waiting for ${in_progress.courier} to pickup your order`
                          : `Your order has been shipped by ${in_progress.courier}`}
                      </p>
                    </div>

                    <Button
                            onClick={() => {
                                dispatch(
                                  openInputModal({
                                    title: "Checkout Details",
                                    component: <ViewOrderDetails order_ID={in_progress.order_ID} />,
                                    onAccept: () => {},
                                    acceptBtnText: "Place Order",
                                    cancelBtnText: "Cancel",
                                  })
                                );
                              }}
                            className="bg-teal-400 text-white w-full rounded-md mt-4"
                          >
                            View Details
                          </Button>

                    <dl class="flex mt-6">
                      <div class="flex flex-col">
                        <dt class="text-sm font-medium text-gray-600">
                          Approved On
                        </dt>
                        <dd class="text-xs text-gray-500">
                          {parseDate(in_progress.cat)}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  
                ))}
                {userData.pending_orders.map((pendings, idx) => (
                  <div
                    key={idx}
                    
                    class="py-8 px-4 mt-4 sm:w-full lg:w-1/3 relative  overflow-hidden border border-gray-100 rounded-lg"
                  >
                    <MdOutlineClose
                      onClick={() => {
                        dispatch(
                          openNotifier({
                            title: "Cancel Order",
                            message: `Are you sure to cancel this order?`,
                            onAccept: () => {
                              cancelOrder(pendings, idx);
                            },
                            acceptBtnText: "Yes",
                            cancelBtnText: "No",
                          })
                        );
                      }}
                      className="absolute right-5 cursor-pointer  text-gray-400 hover:text-red-600 hover:shadow-2xl rounded-full"
                    />
                    <span class="absolute inset-x-0 bottom-0 h-1  bg-gradient-to-r from-yellow-300 via-orange-500 to-red-100"></span>

                    <div class="justify-between sm:flex">
                      <div>
                        <h5 class="text-base  text-gray-900">
                          Order ID: {pendings.order_ID}
                        </h5>
                        <p class="mt-1 text-xs font-medium text-gray-600">
                          Chosen Courier : {pendings.courier}
                        </p>
                        <p class="mt-1 text-xs font-medium text-gray-600">
                          {" "}
                          Status : Pending{" "}
                        </p>
                      </div>
                    </div>

                    <div class="justify-between mt-4 sm:flex">
                      <div>
                        <h5 class="text-xl font-quicksand text-gray-900">
                          Total: ₱{" "}
                          <span className="font-medium">
                            {numberWithCommas(pendings.total_cost)}
                          </span>
                        </h5>
                      </div>
                    </div>

                    <div class="mt-4 sm:pr-8">
                      <p class="text-sm text-yellow-500">
                        This order is waiting for admin approval, this may take
                        1-2 working days.. You can still cancel this
                      </p>
                    </div>

                    <Button
                            onClick={() => {
                                dispatch(
                                  openInputModal({
                                    title: "Checkout Details",
                                    component: <ViewOrderDetails order_ID={pendings.order_ID} />,
                                    onAccept: () => {},
                                    acceptBtnText: "Place Order",
                                    cancelBtnText: "Cancel",
                                  })
                                );
                              }}
                            className="bg-teal-400 text-white w-full rounded-md mt-4"
                          >
                            View Details
                          </Button>

                    <dl class="flex mt-6">
                      <div class="flex flex-col">
                        <dt class="text-sm font-medium text-gray-600">
                          Placed on
                        </dt>
                        <dd class="text-xs text-gray-500">
                          {parseDate(pendings.cat)}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  
                ))}
              </div>
            </div>
          </section>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Orders;
