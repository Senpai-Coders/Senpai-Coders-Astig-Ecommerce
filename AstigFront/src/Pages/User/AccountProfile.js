import React, { useEffect } from "react";

import { useSelector } from "react-redux";
import { Switch } from "react-router-dom";

/* Windmill UI Components */
import { Button } from "@windmill/react-ui";

/* Componentes/Pages */
import Header from "../../Components/Header";
import UserNav from "./UserNav";
import MyCart from "./MyCart";
import Orders from "./Orders";
import ArrivedOrders from "./ArrivedOrders";
import CancelledOrders from "./CancelledOrders";
import Footer from "../../Components/Footer";

/* Protected Route */
import ProtectedRoute from "../../Components/ProtectedRoute";
import ProtectedLoader from "../../Components/ProtectedLoader";

/* Icons */
import { AiOutlineMail } from "react-icons/ai";
import { GoVerified, GoUnverified } from "react-icons/go";
import { IoIosSettings } from "react-icons/io";

import { withRouter } from "react-router-dom";
import { motion } from "framer-motion";

const AccountProfile = (props) => {
  const userData = useSelector((state) => state.user.userData);
  const { history } = props;
  useEffect(()=>{window.scrollTo(0, 0);},[])

  return (
    <motion.div
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.75 }}
    >
      <Header />
      {!userData ? (
        <ProtectedLoader />
      ) : (
        <>
          <div className="min-h-screen">
            <div className="mx-8 mt-24 mb-0 md:flex justify-center items-center">
              <img
                class="object-cover mr-4 w-32 h-32 rounded-full border-8 borderDefCol3"
                src={userData.profile_picture}
                alt=""
              />

              <div className="md:ml-8">
                <p className="text-xl md:text-4xl my-3 font-inter font-medium">
                  {userData.user_name}
                </p>
                <div className="flex items-center text-gray-600 font-inter">
                  <AiOutlineMail className="w-4 h-4 mr-2" />
                  <p className="text-base">{userData.email_address}</p>
                </div>
                <div className="flex pt-3 mb-2 items-center text-gray-600 font-inter">
                  {userData.isVerified ? (
                    <GoVerified className="w-5 h-5 mr-2 text-blue-400" />
                  ) : (
                    <GoUnverified className="w-5 h-5 mr-2 text-orange-600" />
                  )}
                  <p className="text-base">
                    {userData.isVerified ? "Verified" : "Unverified"}
                  </p>
                </div>
                <Button
                  onClick={() => history.push("/account")}
                  className=" mt-2 rounded-lg"
                >
                  <IoIosSettings className="w-5 h-5 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
            <UserNav />
            <Switch>
              <ProtectedRoute exact path="/user/profile" component={MyCart} />
              <ProtectedRoute exact path="/user/mycart" component={MyCart} />
              <ProtectedRoute exact path="/user/myorders" component={Orders} />
              <ProtectedRoute
                exact
                path="/user/arrivedorders"
                component={ArrivedOrders}
              />
              <ProtectedRoute
                exact
                path="/user/cancelledorders"
                component={CancelledOrders}
              />
              <ProtectedRoute exact path="/user/" component={MyCart} />
            </Switch>
          </div>
          <Footer />
        </>
      )}
    </motion.div>
  );
};

export default withRouter(AccountProfile);
