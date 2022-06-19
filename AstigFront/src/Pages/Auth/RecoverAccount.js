import React, { useState } from "react";

import { Link } from "react-router-dom";
import { Button, Label, Input } from "@windmill/react-ui";
import Loader from "../../Components/Loader";

import { BsFillLockFill } from "react-icons/bs";
import { MdAlternateEmail } from "react-icons/md";
import { FaEyeSlash, FaEye } from "react-icons/fa";

/* redux */
import { useDispatch } from "react-redux";
import {
  openAlertModal,
  openInputModal,
  openLoader,
  closeLoader,
} from "../../Features/uiSlice";
import { setRecoveryAccount } from "../../Features/authSlice";

/* API */
import API from "../../Helpers/api";
import RecoveryCodeConfirm from "../../Components/ModalComponent/RecoveryCodeConfirm";

const RecoverAccount = (props) => {
  const [email, setEmail] = useState("");
  const [newPassword, setPassword] = useState("");

  const [passVis, setPassVis] = useState(false);

  const dispatch = useDispatch();

  const togglePassVis = () => {
    setPassVis(!passVis);
  };

  const signInUser = async () => {
    try {
      //dispatch save logindata
      // email_address, newPassword, recovery_code
      dispatch(openLoader({ state: true, message: "checking.." }));
      dispatch(
        setRecoveryAccount({
          email_address: email,
          newPassword,
        })
      );

      const response = await API.post("/auth/recover", {
        email_address: email,
        newPassword,
      });

      dispatch(closeLoader());

      // if twofactorrequired
      if (response.data.recovery_code_sent) {
        //  👍 show inputmodal with custom TODO:  component two factor code
        //  this component should contain function for saving user data like below
        dispatch(closeLoader());
        dispatch(
          openInputModal({
            title: "Recovery Code",
            component: <RecoveryCodeConfirm />,
            onAccept: () => {},
            acceptBtnText: "Change Password",
            cancelBtnText: "Cancel",
          })
        );
        return;
      }
      dispatch(closeLoader());
    } catch (error) {
      //👍 TODO: propper error handling
      dispatch(closeLoader());
      if (error.response) {
        //request was made but theres a response status code
        dispatch(
          openAlertModal({
            component: <></>,
            data: error.response.data,
          })
        );
      } else if (error.request) {
        // The request was made but no response was received
        dispatch(
          openAlertModal({
            component: <></>,
            data: {
              err: 500,
              description: "Sorry, but we can't reach the server",
              solution: "Please try again later",
            },
          })
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
    }
  };

  return (
    <div className="flex items-center min-h-screen p-6 dark:bg-gray-900 bg-gray-50">
      {/*bg-gray-50*/}
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        {" "}
        {/* shadow-xl */}
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full dark:hidden"
              src={
                  "https://cdn.discordapp.com/attachments/912411399458795593/937313922363572224/pexels-photo-66100.png"
              }
              alt="Astig03 Product"
            />
            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block"
              src={
                  "https://cdn.discordapp.com/attachments/912411399458795593/937313922363572224/pexels-photo-66100.png"
              }
              alt="Astig03 Product"
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="font-inter mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Recover Account
              </h1>
              <div className="flex justify-center"></div>
              <Label>
                <span>Email</span>
                <div className="flex relative w-full max-w-xl focus-within:text-teal-600">
                  <div className="absolute inset-y-0 flex items-center pl-2">
                    <MdAlternateEmail className="w-4 h-4 text-teal-600" aria-hidden="true" />
                  </div>
                  <Input
                                        className="my-2 pl-8 rounded-lg border-0 bg-gray-50 transition duration-500 text-gray-400 hover:text-gray-700 focus:text-gray-700"

                    type="email"
                    placeholder="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.currentTarget.value);
                    }}
                  />
                </div>
              </Label>

              <Label className="pt-4 hover:border-gray-400  ">
                <span>New Password</span>
                <div className="flex relative w-full max-w-xl focus-within:text-teal-600">
                  <div className="absolute inset-y-0 flex items-center pl-2">
                    <BsFillLockFill className="w-4 h-4 text-teal-600" aria-hidden="true" />
                  </div>
                  <Input
                                        className="my-2 pl-8 rounded-lg border-0 bg-gray-50 transition duration-500 text-gray-400 hover:text-gray-700 focus:text-gray-700"

                    type={!passVis ? "password" : "text"}
                    placeholder="New Password"
                    onChange={(e) => {
                      setPassword(e.currentTarget.value);
                    }}
                    value={newPassword}
                  />
                  <div
                    onClick={togglePassVis}
                    className="absolute cursor-pointer right-2 inset-y-2 flex items-center pl-2"
                  >
                    {!passVis ? (
                      <FaEyeSlash className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      <FaEye className="w-4 h-4" aria-hidden="true" />
                    )}
                  </div>
                </div>
              </Label>
              <Loader />
              <Button
                className="mt-4 rounded-xl "
                block
                onClick={signInUser}
              >
                Next
              </Button>

              {/* <hr className="my-8" />
  
                <Button block layout="outline">
                  <BsGithub className="w-4 h-4 mr-2" aria-hidden="true" />
                  Github
                </Button>
                <Button className="mt-4" block layout="outline">
                  <BsTwitter className="w-4 h-4 mr-2" aria-hidden="true" />
                  Twitter
                </Button> */}

              <p className="mt-4">
                <Link
                  className="text-sm font-medium defTextCol hover:underline"
                  to="/auth/signin"
                >
                  Sign In
                </Link>
              </p>
              <p className="mt-1">
                <Link
                  className="text-sm font-medium defTextCol hover:underline"
                  to="/auth/signup"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default RecoverAccount;
