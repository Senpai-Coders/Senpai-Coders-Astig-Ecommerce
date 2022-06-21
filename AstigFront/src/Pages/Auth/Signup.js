import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";

/* Components */
import RegistrationConfirm from "../../Components/ModalComponent/RegistrationConfirm";
import Loader from "../../Components/Loader";
import { Link } from "react-router-dom";
import { Button, Label, Input, Alert } from "@windmill/react-ui";

/* Icons */
import { BsFillLockFill } from "react-icons/bs";
import { MdAlternateEmail } from "react-icons/md";
import { CgUserlane } from "react-icons/cg";
import { RiUser6Fill } from "react-icons/ri";
import { FaEyeSlash, FaEye } from "react-icons/fa";

/* Redux, Reducers */
import { useDispatch, useSelector } from "react-redux";
import {
  closeLoader,
  openInputModal,
  openAlertModal,
} from "../../Features/uiSlice";
import { openLoader } from "../../Features/uiSlice";
import {
  partialRegistration,
  setSignInCredential,
  cleanSignInCredential,
} from "../../Features/authSlice";
import { signin } from "../../Features/userSlice";

/* API */
import API from "../../Helpers/api";
import { saveAuth } from "../../Helpers/uitils"

/* GAuth identity */
import { GoogleLogin } from "react-google-login";
import googleOneTap from "google-one-tap";

const Signup = (props) => {
  const dispatch = useDispatch();
  const uiState = useSelector((state) => state.ui);

  const [name, setName] = useState("");
  const [user_name, setUserName] = useState("");
  const [email_address, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const [validation, setValidation] = useState(true);
  const [validMsg, setValidMsg] = useState("");

  const [passVis, setPassVis] = useState(false);
  const [passVis2, setPassVis2] = useState(false);

  useEffect(() => {}, []);

  //validate the form inputs
  const validate = () => {
    if (name === "") {
      setValidMsg("Name is empty!");
      return false;
    }

    if (user_name === "") {
      setValidMsg("username is empty!");
      return false;
    }

    if (email_address === "") {
      setValidMsg("email address is empty!");
      return false;
    } else if (!/^\S+@\S+\.\S+$/.test(email_address)) {
      setValidMsg("email address is not valid!");
      return false;
    }

    if (password !== rePassword) {
      setValidMsg("Password doesn't match");
      return false;
    } else if (password.length === 0 || rePassword.length === 0) {
      setValidMsg("Password should not be empty");
      return false;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password)) {
      setValidMsg(
        "Password should have 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number"
      );
      return false;
    }

    setValidation(true);
    return true;
  };

  //Partial Registration
  const submitPartialRegistration = () => {
    dispatch(openLoader({ state: true, message: "please wait.." }));

    if (!validate()) {
      dispatch(closeLoader());
      setValidation(false);
      return;
    }

    API.post("/auth/confirm_email", {
      name,
      user_name,
      email_address,
      password,
    })
      .then((response) => {
        dispatch(closeLoader());
        dispatch(
          partialRegistration({
            name,
            user_name,
            email_address,
            password,
          })
        );
        dispatch(
          openInputModal({
            title: "Verification Code",
            component: <RegistrationConfirm />,
            onAccept: () => {},
            acceptBtnText: "Finish",
            cancelBtnText: "Cancel",
          })
        );
      })
      .catch((error) => {
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
      });
  };

  //Toggle password Visibility
  const togglePassVis = () => {
    setPassVis(!passVis);
  };

  //Toggle retype pass Visibility2
  const togglePassVis2 = () => {
    setPassVis2(!passVis2);
  };

  const CLID = process.env.REACT_APP_GCLIENTID;
  const AUTO_SIGNIN = process.env.REACT_APP_AUTO_SIGN_IN;

  const GOnSuccess = async (res) => {
    try {
      //dispatch save logindata
      dispatch(openLoader({ state: true, message: "checking.." }));
      dispatch(
        setSignInCredential({
          email_address: email_address.toLowerCase(),
          password,
        })
      );
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
          email_address,
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
                "https://cdn.discordapp.com/attachments/912411399458795593/937315295683543050/pexels-photo-2660262.png"
              }
              alt="astig03 product"
            />
            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block"
              src={
                "https://cdn.discordapp.com/attachments/912411399458795593/937315295683543050/pexels-photo-2660262.png"
              }
              alt="astig03 product"
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="font-inter mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Create Astig03 Account
              </h1>
              <div className="flex justify-center"></div>
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
                    Sign Up with Google
                  </Button>
                )}
                cookiePolicy={"single_host_origin"}
                isSignedIn={false}
              />
              <div className="mt-4 flex">
                <Label>
                  <span>Name*</span>
                  <div className="flex relative w-full max-w-xl focus-within:text-teal-600">
                    <div className="absolute inset-y-0 flex items-center pl-2">
                      <RiUser6Fill className="w-4 h-4 text-teal-600" aria-hidden="true" />
                    </div>
                    <Input
                      className="my-2 pl-8 mr-1 rounded-lg border-0 bg-gray-100 transition duration-500 text-gray-400 hover:text-gray-700 focus:text-gray-700"
                      type="text"
                      placeholder="name"
                      value={name}
                      onChange={(e) => {
                        setName(e.currentTarget.value);
                      }}
                    />
                  </div>
                </Label>
                <Label>
                  <span>Username*</span>
                  <div className="flex relative w-full max-w-xl focus-within:text-teal-600">
                    <div className="absolute inset-y-0 flex items-center pl-2">
                      <CgUserlane className="w-4 h-4 text-teal-600" aria-hidden="true" />
                    </div>
                    <Input
                      className="my-2 pl-8 ml-1 rounded-lg border-0 bg-gray-100 transition duration-500 text-gray-400 hover:text-gray-700 focus:text-gray-700"
                      type="text"
                      placeholder="username"
                      value={user_name}
                      onChange={(e) => {
                        setUserName(e.currentTarget.value);
                      }}
                    />
                  </div>
                </Label>
              </div>
              <Label className="pt-4">
                <span>Email*</span>
                <div className="flex relative w-full max-w-xl focus-within:text-teal-600">
                  <div className="absolute inset-y-0 flex items-center pl-2">
                    <MdAlternateEmail className="w-4 h-4 text-teal-600" aria-hidden="true" />
                  </div>
                  <Input
                    className="my-2 pl-8 rounded-lg border-0 bg-gray-100 transition duration-500 text-gray-400 hover:text-gray-700 focus:text-gray-700"
                    type="email"
                    placeholder="Email"
                    value={email_address}
                    onChange={(e) => {
                      setEmailAddress(e.currentTarget.value);
                    }}
                  />
                </div>
              </Label>
              <Label className="pt-4 hover:border-gray-400  ">
                <span>Password *</span>
                <div className="flex relative w-full max-w-xl focus-within:text-teal-600">
                  <div className="absolute inset-y-0 flex items-center pl-2">
                    <BsFillLockFill className="w-4 h-4 text-teal-600" aria-hidden="true" />
                  </div>
                  <Input
                    className="my-2 pl-8 rounded-lg border-0 bg-gray-100 transition duration-500 text-gray-400 hover:text-gray-700 focus:text-gray-700"
                    type={!passVis ? "password" : "text"}
                    placeholder=""
                    onChange={(e) => {
                      setPassword(e.currentTarget.value);
                    }}
                    value={password}
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
              <Label className="pt-4">
                <span>Confirm Password*</span>
                <div className="flex relative w-full max-w-xl focus-within:text-teal-600">
                  <div className="absolute inset-y-0 flex items-center pl-2">
                    <BsFillLockFill className="w-4 h-4 text-teal-600" aria-hidden="true" />
                  </div>
                  <Input
                    className="my-2 pl-8 rounded-lg border-0 bg-gray-100 transition duration-500 text-gray-400 hover:text-gray-700 focus:text-gray-700"
                    type={!passVis2 ? "password" : "text"}
                    placeholder=""
                    onChange={(e) => {
                      setRePassword(e.currentTarget.value);
                    }}
                    value={rePassword}
                  />
                  <div
                    onClick={togglePassVis2}
                    className="absolute cursor-pointer right-2 inset-y-2 flex items-center pl-2"
                  >
                    {!passVis2 ? (
                      <FaEyeSlash className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      <FaEye className="w-4 h-4" aria-hidden="true" />
                    )}
                  </div>
                </div>
              </Label>
              <Loader />
              <Alert
                className={!validation ? "block mt-3" : "hidden"}
                type="danger"
              >
                {validMsg}
              </Alert>
              <Button
                disabled={uiState.loader.state}
                onClick={submitPartialRegistration}
                className="mt-4 rounded-md "
                block
              >
                Sign Up
              </Button>

              <p className="mt-4">
                <Link
                  className="text-sm cursor-pointer font-medium defTextCol hover:underline"
                  to="/auth/recover"
                >
                  Recover Account
                </Link>
              </p>
              <p className="mt-1">
                <Link
                  className="text-sm cursor-pointer font-medium defTextCol hover:underline"
                  to="/auth/signin"
                >
                  Sign In
                </Link>
              </p>
              <p className="mt-4 text-sm text-center">
                Are you an admin?{" "}
                <Link
                  className="text-sm font-medium defTextCol hover:underline"
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

export default withRouter(Signup);
