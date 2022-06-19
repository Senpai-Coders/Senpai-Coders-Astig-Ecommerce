import React, { useEffect, useState } from "react";

import { openAlertModal, openInputModal } from "../../Features/uiSlice";
import Informative from "../../Components/Modal/Informative";

import { Button } from "@windmill/react-ui";

import { BsFillGrid1X2Fill } from "react-icons/bs";
import { MdOutlineClose } from "react-icons/md";

import { useSelector, useDispatch } from "react-redux";
import { signin, signout } from "../../Features/userSlice";
import { openNotifier } from "../../Features/uiSlice";

import FullPageLoader from "../../Components/FullPageLoader";
import Checkout from "../../Components/ModalComponent/Checkout";

/* Axios API */
import API from "../../Helpers/api";
import { getAuth } from "../../Helpers/uitils"


import { numberWithCommas } from "../../Helpers/uitils";
import { Link } from "react-router-dom";

import  { motion } from "framer-motion"

const MyCart = () => {
  const userData = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();


  const [loading, setLoading] = useState(true);

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
      dispatch(signin(response.data.userData));
      setLoading(false);
    } catch (error) {
      if (error.response){
        dispatch(
          openAlertModal({
            component: <Informative />,
            data: {
              description: error.response.data.description,
              solution: error.response.data.solution,
            },
          })
        );
        return
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

  const checkout = () => {
    if (userData.cart.total_items === 0) {
      dispatch(
        openAlertModal({
          component: <Informative />,
          data: {
            description: "Checkout Failed",
            solution: "Sorry, but you don't have any item on your cart",
          },
        })
      );
      return;
    }

    // show modal
    dispatch(
      openInputModal({
        title: "Checkout Details",
        component: <Checkout />,
        onAccept: () => {},
        acceptBtnText: "Place Order",
        cancelBtnText: "Cancel",
      })
    );
  };

  const deleteItem = async (item, IDX) => {
    try {
      let CART = { ...userData.cart };

      CART.items = CART.items.filter((item, idx) => idx !== IDX);
      CART.total_items = CART.items.length;
      CART.total_cost -= item.variant_price * item.qty;


      const response = await API.post("/user/updatecart", {
        _id: userData._id,
        cart: CART,
        auth : getAuth()
      });

      if(response){
          
      }
      await loadUserData();
      dispatch(
        openAlertModal({
          component: <Informative />,
          data: {
            description: "Item Removed",
            solution: "The items was removed from your cart!",
          },
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(
        openAlertModal({
          component: <Informative />,
          data: {
            description: "Removal of item failed",
            solution:
              "Sorry, but the system failed removed from your cart! try again later",
          },
        })
      );
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);
  useEffect(()=>{window.scrollTo(0, 0);},[])

  return (
    <motion.div className="min-h-64"
        initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.75 }}
      >
      {loading ? (
        <FullPageLoader />
      ) : (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.75 }}>
          <div className="flex justify-evenly">
            <Button
              disabled={userData.cart.total_items === 0}
              onClick={() => checkout()}
              className="w-1/4 my-3 px-4 py-2 text-base  hover:bg-teal-500 rounded-lg text-white"
            >
              Checkout
            </Button>
          </div>
          
          <div className="flex justify-evenly items-center defText-Col-2">
            {userData.cart.total_items === 0 ? (
              <></>
            ) : (
              <>
                <div className="flex justify-center items-center">
                  <BsFillGrid1X2Fill className="h-5 w-5 mr-4 " />
                  <p className="font-inter text-2xl defText-Col-2 font-light tracking-wider">
                    {userData.cart.total_items} Item(s)
                  </p>
                </div>
                <div>
                  <p className="font-inter text-xl defText-Col-2 font-light tracking-wider">
                    Total : {userData.cart.total_cost}
                  </p>
                </div>
              </>
            )}
          </div>
          {userData.cart.total_items === 0 && (
            <>
              <div className="w-full mt-4">
                <p className="w-full text-center text-gray-600">
                  Your cart is empty
                </p>
              </div>
            </>
          )}
          <section className=" body-font mx-8">
            <div className="container px-5 py-24 mx-auto">
              <div className="flex flex-wrap -mx-4 -my-8 ">
                {userData.cart.total_items > 0 ? (
                  userData.cart.items.map((item, idx) => (
                    <div key={idx} className="py-8 px-4 lg:w-1/3 ">
                      <div className="relative h-full flex items-start">
                        <MdOutlineClose
                          onClick={() =>
                            dispatch(
                              openNotifier({
                                title: "Remove Item From Cart",
                                message: `You are about to remove ${item.product_name} from your cart`,
                                onAccept: () => {
                                  deleteItem(item, idx);
                                },
                                acceptBtnText: "Yes, Remove It",
                                cancelBtnText: "Cancel",
                              })
                            )
                          }
                          className="absolute right-5 cursor-pointer  text-gray-400 hover:text-red-600 hover:shadow-2xl rounded-full"
                        />
                        <div className=" flex-shrink-0 flex flex-col text-center leading-none">
                          {/* <span className="text-gray-500 pb-2 mb-2 border-b-2 border-gray-200">
                            QTY
                          </span>
                          <span className="font-medium text-lg text-gray-800 title-font leading-none">
                            {item.qty}
                          </span> */}
                          <img
                            width="100px"
                            src={item.thumb}
                            alt={item.product_name}
                          ></img>
                        </div>
                        <div className="flex-grow pl-6">
                          {/* <h2 className="tracking-widest text-md title-font font-medium text-teal-500 mb-1">
                            OrderID : as08sa97g89ang91n
                          </h2> */}
                          <h1 className=" title-font text-xl text-gray-900 mb-3">
                            {item.product_name}
                          </h1>
                          <div className="inline-flex items-center">
                            <span className="flex-grow flex flex-col">
                              <p className=" text-gray-600">
                                Php{" "}
                                <span className="text-teal-700 font-medium">
                                  {numberWithCommas(item.variant_price)}
                                </span>
                              </p>
                            </span>
                            <p className="bg-gray-100 mt-2 rounded-lg ml-4 text-sm font-medium px-2 py-1">
                              {item.variant}
                            </p>
                            <p className="bg-gray-100 mt-2 rounded-lg ml-4 py-1 px-4 text-sm font-semibold">
                              x{item.qty}
                            </p>
                          </div>
                          <div className=" w-1/6 flex items-center"></div>
                          <Link
                            to={`/productdetail/${item.product_ID}`}
                            className="text-blue-500 mt-2"
                          >
                            View Product
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <></>
                )}
              </div>
            </div>
          </section>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MyCart;
