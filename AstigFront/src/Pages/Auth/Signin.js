import React, { useState, useEffect } from "react";

import { Link, withRouter } from "react-router-dom";
import { Button, Label, Input } from "@windmill/react-ui";
import Loader from "../../Components/Loader";

import { BsFillLockFill } from "react-icons/bs";
import { MdAlternateEmail } from "react-icons/md";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc"

/* redux */
import { useDispatch } from "react-redux";
import { signin } from "../../Features/userSlice";
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

import TwoFactorAuthConfirm from "../../Components/ModalComponent/TwoFactorAuthConfirm";

/* GLogin - OneTap and Login */
import { GoogleLogin } from "react-google-login";
import googleOneTap from "google-one-tap";

/* GAssets */
//import GLogo from "../../assets/google_signin_buttons/g_logo_transparent.svg";

/* env */
require("dotenv").config();

const Singin = (props) => {
  const CLID = process.env.REACT_APP_GCLIENTID;
  const AUTO_SIGNIN = process.env.REACT_APP_AUTO_SIGN_IN;

  const [email, setEmail] = useState("");
  const [passVis, setPassVis] = useState(false);
  const [password, setPassword] = useState("");

  const togglePassVis = () => {
    setPassVis(!passVis);
  };

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
        })
      );

      const response = await API.post(
        "/auth/signin",
        {
          email_address: email,
          password,
          oauth: false,
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
            component: <TwoFactorAuthConfirm />,
            onAccept: () => {},
            acceptBtnText: "Finish",
            cancelBtnText: "Cancel",
          })
        );
        return;
      }

      dispatch(closeLoader());

      // get user data
      // dispatch signin
      // dispatch clear signin
      // history push / or home
      const userData = response.data.userData;

      dispatch(signin(userData));
      dispatch(cleanSignInCredential());
      localStorage.setItem("userData", JSON.stringify(userData));
      saveAuth(response)
      props.history.push("/");
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
        })
      );
      console.log("Success!")
      const response = await API.post(
        "/auth/signin",
        {
          access_token: res.tokenId,
          client_id: CLID,
        },
        { withCredentials: true }
      );
      dispatch(closeLoader());
      const userData = response.data.userData;
      dispatch(signin(userData));
      dispatch(cleanSignInCredential());
      localStorage.setItem("userData", JSON.stringify(userData));
      saveAuth(response)
      props.history.push("/");
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
    console.log("Fail!", res)
  };

  const options = {
    client_id: CLID, // required
    auto_select: AUTO_SIGNIN, // optional
    cancel_on_tap_outside: false, // optional
    context: "signin", // optional
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
        })
      );
      const response = await API.post(
        "/auth/signin",
        {
          access_token: res.credential,
          client_id: res.clientId,
        },
        { withCredentials: true }
      );
      dispatch(closeLoader());
      const userData = response.data.userData;
      dispatch(signin(userData));
      dispatch(cleanSignInCredential());
      localStorage.setItem("userData", JSON.stringify(userData));
      saveAuth(response)
      props.history.push("/");
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
    <div
      id="auth_signin"
      className="flex items-center min-h-screen p-6 dark:bg-gray-900 bg-gray-50"
    >
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
                "https://cdn.discordapp.com/attachments/912411399458795593/937312520690077716/pexels-photo-4843914.png"
              }
              alt="astig03 product"
            />
            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block"
              src={
                "https://cdn.discordapp.com/attachments/912411399458795593/937312549664337920/pexels-photo-2562560.png"
              }
              alt="astig03 product"
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="font-inter mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Sign in to Astig03
              </h1>
              <GoogleLogin
                clientId={CLID}
                buttonText="Sign In"
                onSuccess={GOnSuccess}
                onFailure={GOnFailure}
                autoLoad={false}
                render={(renderProps) => (
                  <Button
                    className="my-2 font-inter rounded-xl font-medium google_signin"
                    block
                    onClick={renderProps.onClick}
                  >
                    {/*<img className="w-5 mr-3" src={GLogo} alt='google icon' />*/}
                    <div className="mr-3">
                      <FcGoogle  />
                    </div>
                    Sign in with Google
                  </Button>
                )}
                cookiePolicy={"single_host_origin"}
                isSignedIn={false}
              />
              <p
                className="my-2 text-xs text-center  font-inter font-bold"
                style={{ color: "#2A9E9A" }}
              >
                or
              </p>
              <Label>
                <span>Email</span>
                <div className="flex relative w-full max-w-xl focus-within:defTextCol">
                  <div className="absolute inset-y-0 flex items-center pl-2">
                    <MdAlternateEmail
                      className="w-4 h-4 defTextCol"
                      aria-hidden="true"
                    />
                  </div>
                  <Input
                    className="my-2 pl-8 rounded-lg border-0 bg-gray-50 transition duration-500 text-gray-400 hover:text-gray-700 focus:text-gray-700"
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
                <div className="flex relative w-full max-w-xl focus-within:defTextCol">
                  <div className="absolute inset-y-0 flex items-center pl-2">
                    <BsFillLockFill
                      className="w-4 h-4 defTextCol"
                      aria-hidden="true"
                    />
                  </div>
                  <Input
                    className="my-2 pl-8 rounded-lg border-0 bg-gray-50 transition duration-500 text-gray-400 hover:text-gray-700 focus:text-gray-700"
                    type={!passVis ? "password" : "text"}
                    placeholder=""
                    onChange={(e) => {
                      setPassword(e.currentTarget.value);
                    }}
                    value={password}
                  />
                  <div
                    onClick={togglePassVis}
                    className="absolute cursor-pointer right-2 inset-y-2 flex defTextCol items-center pl-2"
                  >
                    {!passVis ? (
                      <FaEyeSlash className="w-4 h-4 defTextCol" aria-hidden="true" />
                    ) : (
                      <FaEye className="w-4 h-4 defTextCol" aria-hidden="true" />
                    )}
                  </div>
                </div>
              </Label>
              <Loader />
              <Button
                className="mt-7 rounded-xl "
                block
                onClick={signInUser}
              >
                Signin
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
                  className="text-sm font-medium defTextCol dark:text-purple-400 hover:underline"
                  to="/auth/recover"
                >
                  Recover Account
                </Link>
              </p>
              <p className="mt-1">
                <Link
                  className="text-sm font-medium defTextCol dark:text-purple-400 hover:underline"
                  to="/auth/signup"
                >
                  Sign Up
                </Link>
              </p>
              <p className="mt-4 text-sm text-center">
                Are you an admin?{" "}
                <Link
                  className="text-sm font-medium defTextCol dark:text-purple-400 hover:underline"
                  to="/auth/admin_signin"
                >
                  Sign in here..
                </Link>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Singin);
