import React, { useEffect, useState } from "react";

import { MdOutlineClose } from "react-icons/md";

import Informative from "../../Components/Modal/Informative";
import FullPageLoader from "../../Components/FullPageLoader";
import API from "../../Helpers/api";
import { getAuth } from "../../Helpers/uitils"


import { useSelector, useDispatch } from "react-redux";
import { signin, signout } from "../../Features/userSlice";
import { openNotifier } from "../../Features/uiSlice";

import { openAlertModal, openInputModal } from "../../Features/uiSlice";

import ViewOrderDetails from "../../Components/ViewOrderDetails";
import { parseDate, numberWithCommas, getUserTickUpdate } from "../../Helpers/uitils"

import {Button} from "@windmill/react-ui"

import { motion } from "framer-motion"

const ArrivedOrders = () => {
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

  const removeCancelled = async (item) => {
    try {
      const deleteRecord = await API.post("/user/removeCancelled", {
        _id: userData._id,
        cancelled: item,
        auth : getAuth()
      });
      if(deleteRecord){}
      await loadUserData();
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
        <motion.div initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.75 }}>
          <p className="text-2xl text-center font-medium">Cancelled Orders</p>
          <section className="text-gray-600 body-font mx-8">
            <div className="container px-5 py-24 mx-auto">
              <div className="flex flex-wrap -mx-4 -my-8 ">
                {userData.cancelled.length === 0 && (
                  <>
                    <div className="w-full">
                      <p className="w-full text-center">
                        You have no cancelled orders
                      </p>
                    </div>
                  </>
                )}
                {userData.cancelled.map((cancelled, idx) => (
                     <div
                     key={idx}
                     
                     class="py-8 px-4 mt-4 sm:w-full lg:w-1/3 relative  overflow-hidden border border-gray-100 rounded-lg"
                   >
                     <MdOutlineClose
                         onClick={() => {
                           dispatch(
                             openNotifier({
                               title: "Delete cancelled/Arrived Record",
                               message: `Are you sure to delete this record?`,
                               onAccept: () => {
                                 removeCancelled(cancelled);
                               },
                              acceptBtnText: "Yes",
                           cancelBtnText: "No",
                             })
                           );
                         }}
                         className="absolute right-5 cursor-pointer  text-gray-400 hover:text-red-600 hover:shadow-2xl rounded-full"
                       />
                     <span class="absolute inset-x-0 bottom-0 h-1  bg-gradient-to-r from-orange-300 via-red-500 to-read-400"></span>
 
                     <div class="justify-between sm:flex">
                       <div>
                         <h5 class="text-base  text-gray-900">
                           Order ID: {cancelled.order_ID}
                         </h5>
                         <p class="mt-1 text-xs font-medium text-gray-600">
                           Chosen Courier : {cancelled.courier}
                         </p>
                         <p class="mt-1 text-xs font-medium text-gray-600">
                           {" "}
                           Status : Cancelled
                         </p>
                       </div>
                     </div>
 
                     <div class="justify-between mt-4 sm:flex">
                       <div>
                         <h5 class="text-xl font-quicksand text-gray-900">
                           Total: ₱{" "}
                           <span className="font-medium">
                             {numberWithCommas(cancelled.total_cost)}
                           </span>
                         </h5>
                       </div>
                     </div>
 
                     <div class="mt-4 sm:pr-8">
                       <p class="text-sm text-red-500">
                         This order was cancelled
                       </p>
                       <p class="text-sm text-red-500">
                         Reason : {" "}
                         {
                             cancelled.reason
                         }
                       </p>
                     </div>

                     <Button
                            onClick={() => {
                                dispatch(
                                  openInputModal({
                                    title: "Checkout Details",
                                    component: <ViewOrderDetails order_ID={cancelled.order_ID} />,
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
                           Cancelled On
                         </dt>
                         <dd class="text-xs text-gray-500">
                           {parseDate(cancelled.dat)}
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

export default ArrivedOrders;
