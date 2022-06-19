import React, { useState, useEffect } from "react";

import { Link, withRouter } from "react-router-dom";
import { Button, Label, Input } from "@windmill/react-ui";
import Loader from "../../Components/Loader";
import HelperLabel from "../../Components/HelperLabel"

import { BsFillLockFill } from "react-icons/bs";
import { MdAlternateEmail } from "react-icons/md";
import { FaEyeSlash, FaEye } from "react-icons/fa";

/* redux */
import { useDispatch } from "react-redux";
import { adminSign } from "../../Features/adminSlice"
import {
  openAlertModal,
  openInputModal,
  openLoader,
  closeLoader,
} from "../../Features/uiSlice";
import {
  setSignInCredential,
  cleanSignInCredential,
} from "../../Features/authSlice";

/* API */
import API from "../../Helpers/api";
import { saveAuth } from "../../Helpers/uitils"

import AdminTwoFactorAuthConfirm from "../../Components/ModalComponent/Admin/AdminTwoFactorAuthConfirm";

/* GLogin - OneTap and Login */ 
import { GoogleLogin } from "react-google-login";
import googleOneTap from 'google-one-tap';

/* GAssets */
//import GLogo from "../../assets/google_signin_buttons/g_logo_transparent.svg";

/* env */
require("dotenv").config();

const SignAdmin = (props) => {
  
  const CLID = process.env.REACT_APP_GCLIENTID;
  const AUTO_SIGNIN = process.env.REACT_APP_AUTO_SIGN_IN

  const [email, setEmail] = useState("");
  const [passVis, setPassVis] = useState(false);
  const [password, setPassword] = useState("");

  const togglePassVis = () => { setPassVis(!passVis); };

  const dispatch = useDispatch();

  useEffect(() => {}, []);

  const signInUser = async () => {
    try {
      //dispatch save logindata
      dispatch(openLoader({ state: true, message: "checking.." }));
      dispatch(
        setSignInCredential({
          email_address: email,
          password,
          admin : true
        })
      );

      const response = await API.post(
        "/auth/signin",
        {
          email_address: email,
          password,
          oauth: false,
          admin : true
        },
        { withCredentials: true }
      );


      dispatch(closeLoader());

      // if twofactorrequired
      if (response.data.twoFactorRequired) {
        //  👍 show inputmodal with custom TODO:  component two factor code
        //  this component should contain function for saving user data like below
        dispatch(closeLoader());
        dispatch(
          openInputModal({
            title: "Verification Code",
            component: <AdminTwoFactorAuthConfirm />,
            onAccept: () => {},
            acceptBtnText: "Finish",
            cancelBtnText: "Cancel",
          })
        );
        return;
      }

      dispatch(closeLoader());

      const adminData = response.data.userData;
      dispatch(adminSign(adminData));
      dispatch(cleanSignInCredential());
      localStorage.setItem("adminData", JSON.stringify(adminData));
      saveAuth(response)
      props.history.push("/admin");
    } catch (error) {
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

  /* G Login */
  const GOnSuccess = async (res) => {
    try {
      //dispatch save logindata
      dispatch(openLoader({ state: true, message: "checking.." }));
      dispatch(
        setSignInCredential({
          email_address: email,
          password,
          admin : true
        })
      );
      const response = await API.post(
        "/auth/signin",
        {
          access_token : res.tokenId,
          client_id : CLID,
          admin : true
        },
        { withCredentials: true }
      );
      dispatch(closeLoader());
      const adminData = response.data.userData;
      dispatch(adminSign(adminData));
      dispatch(cleanSignInCredential());
      localStorage.setItem("adminData", JSON.stringify(adminData));
      saveAuth(response)
      props.history.push("/admin");
    } catch (error) {
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

  /* G One Tap */
  const GOnFailure = async (res) => {
  };

  
  const options = {
    client_id: CLID, // required
    auto_select: AUTO_SIGNIN, // optional
    cancel_on_tap_outside: false, // optional
    context: 'signin', // optional
  };

  googleOneTap(options, async (res) => {
    // Send response to server
    try {
      //dispatch save logindata
      dispatch(openLoader({ state: true, message: "checking.." }));
      dispatch(
        setSignInCredential({
          email_address: email,
          password,
          admin : true
        })
      );
      const response = await API.post(
        "/auth/signin",
        {
          access_token : res.credential,
          client_id : res.clientId,
          admin : true
        },
        { withCredentials: true }
      );
      dispatch(closeLoader());
      const adminData = response.data.userData;
      dispatch(adminSign(adminData));
      dispatch(cleanSignInCredential());
      localStorage.setItem("adminData", JSON.stringify(adminData));
      saveAuth(response)
      props.history.push("/admin");
    } catch (error) {
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
  });

  return (
    <div id="auth_signin" className="flex items-center min-h-screen p-6 dark:bg-gray-900 bg-gray-50">{/*bg-gray-50*/} 
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800"> {/* shadow-xl */}
        <div className="flex flex-col overflow-y-auto md:flex-row">
        <div className="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full dark:hidden"
              src={"https://cdn.discordapp.com/attachments/912411399458795593/937321262903074876/pexels-photo-1646953.png"}
              alt="Loft Product"
            />
            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block"
              src={"https://cdn.discordapp.com/attachments/912411399458795593/937321262903074876/pexels-photo-1646953.png"}
              alt="Loft Product"
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="my-4 font-extrabold text-2xl text-teal-600">
                HELLO ADMIN
              </h1>
              <GoogleLogin
                clientId={CLID}
                buttonText="Sign In"
                onSuccess={GOnSuccess}
                onFailure={GOnFailure}
                autoLoad={false}
                render={(renderProps) => (
                  <Button
                    className="my-2 google_signin font-inter rounded-xl font-medium text-gray-800 gbutton"
                    block
                    onClick={renderProps.onClick}
                  >
                    {/*<img className="w-5 mr-3" src={GLogo} alt='google icon' />*/}
                    <div className="mr-3">
                      <svg
                        width="18"
                        height="18"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g fill="#000" fill-rule="evenodd">
                          <path
                            d="M9 3.48c1.69 0 2.83.73 3.48 1.34l2.54-2.48C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l2.91 2.26C4.6 5.05 6.62 3.48 9 3.48z"
                            fill="#EA4335"
                          ></path>
                          <path
                            d="M17.64 9.2c0-.74-.06-1.28-.19-1.84H9v3.34h4.96c-.1.83-.64 2.08-1.84 2.92l2.84 2.2c1.7-1.57 2.68-3.88 2.68-6.62z"
                            fill="#4285F4"
                          ></path>
                          <path
                            d="M3.88 10.78A5.54 5.54 0 0 1 3.58 9c0-.62.11-1.22.29-1.78L.96 4.96A9.008 9.008 0 0 0 0 9c0 1.45.35 2.82.96 4.04l2.92-2.26z"
                            fill="#FBBC05"
                          ></path>
                          <path
                            d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.84-2.2c-.76.53-1.78.9-3.12.9-2.38 0-4.4-1.57-5.12-3.74L.97 13.04C2.45 15.98 5.48 18 9 18z"
                            fill="#34A853"
                          ></path>
                          <path fill="none" d="M0 0h18v18H0z"></path>
                        </g>
                      </svg>
                    </div>
                    Sign in with Google
                  </Button>
                )}
                cookiePolicy={"single_host_origin"} isSignedIn={false}/>
                <p className="my-2 text-xs text-center  font-inter font-bold" style={{color : "#2A9E9A"}}>or</p>
              <Label>
                <span>Email</span>
                <div className="flex relative w-full max-w-xl focus-within:text-teal-500">
                  <div className="absolute inset-y-0 flex items-center pl-2">
                    <MdAlternateEmail className="w-4 h-4 text-teal-600" aria-hidden="true" />
                  </div>
                  <Input
                    className="mt-1 pl-8 text-teal-800 hover:border-gray-400  bg-gray-50"
                    type="email"
                    placeholder=""
                    value={email}
                    onChange={(e) => {
                      setEmail(e.currentTarget.value);
                    }}
                  />
                </div>
              </Label>
              <Label className="pt-4 hover:border-gray-400  ">
                <span>Password</span>
                <div className="flex relative w-full max-w-xl focus-within:text-teal-500">
                  <div className="absolute inset-y-0 flex items-center pl-2">
                    <BsFillLockFill className="w-4 h-4 text-teal-500" aria-hidden="true" />
                  </div>
                  <Input
                    className="mt-1 pl-8 text-teal-800 bg-gray-50 hover:border-gray-400  "
                    type={!passVis ? "password" : "text"}
                    placeholder=""
                    onChange={(e) => {
                      setPassword(e.currentTarget.value);
                    }}
                    value={password}
                  />
                  <div
                    onClick={togglePassVis}
                    className="absolute cursor-pointer right-2 inset-y-2 flex text-teal-500 items-center pl-2"
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
                className="mt-7 rounded-xl defBackground hover:bg-green-500"
                block
                onClick={signInUser}
              >
                Signin
              </Button>
              <HelperLabel
              className="mt-4 "
                  isError={false}
                  bg={"bg-teal-50"}
                  txtbg={"text-teal-600"}
                  msg={"If you forgot your credentials, please seek help from the store root admin"}
                />

              {/* <hr className="my-8" />

              <Button block layout="outline">
                <BsGithub className="w-4 h-4 mr-2" aria-hidden="true" />
                Github
              </Button>
              <Button className="mt-4" block layout="outline">
                <BsTwitter className="w-4 h-4 mr-2" aria-hidden="true" />
                Twitter
              </Button> */}

              {/* <p className="mt-4">
                <Link
                  className="text-sm font-medium text-blue-600 dark:text-purple-400 hover:underline"
                  to="/auth/recover"
                >
                  Recover Account
                </Link>
              </p>
              <p className="mt-1">
                <Link
                  className="text-sm font-medium text-blue-600 dark:text-purple-400 hover:underline"
                  to="/auth/signup"
                >
                  Sign Up
                </Link>
              </p> */}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default withRouter(SignAdmin);
