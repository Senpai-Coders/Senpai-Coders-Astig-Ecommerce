import React, { useState } from "react";
import { Label, Input, Button, Alert } from "@windmill/react-ui";
import { HiLockClosed } from "react-icons/hi";
import { withRouter } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { finalRegistration, cleanRegistration } from "../../Features/authSlice";
import {
  closeLoader,
  openAlertModal,
  closeAlertModal,
  closeInputModal,
} from "../../Features/uiSlice";
import { signin } from "../../Features/userSlice";

import API from "../../Helpers/api";

const RegistrationConfirm = (props) => {
  const authRegisterState = useSelector((state) => state.auth.registration);
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth.registration )

  const [codeStatus, setCodeStatus] = useState(true);
  const [codeError, setCodeError] = useState("");

  const resend = () => {
    API.post("/auth/confirm_email", auth )
      .then((response) => {
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

  const saveCode = (e) => {
    let confirmation_code = e.target.value;
    dispatch(finalRegistration({ confirmation_code }));
    setCodeStatus(true);
  };

  const finalSignup = () => {
    API.post("/auth/signup", {
      ...authRegisterState,
    })
      .then((res) => {
        dispatch(closeInputModal());
        dispatch(closeAlertModal());
        dispatch(signin(res.data.userData));
        localStorage.setItem("userData", JSON.stringify(res.data.userData));
        localStorage.setItem("acc_token", JSON.stringify(res.data.access_token));
        dispatch(cleanRegistration());
        props.history.push("/");
      })
      .catch((error) => {
        console.log(error);
        dispatch(closeLoader());
        if (error.response) {
          //request was made but theres a response status code
          setCodeStatus(false);
          console.log(error.response);
          setCodeError(error.response.data.description);
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
          console.log(error);
        }
      });
  };

  return (
    <div>
      <div className="flex-grow">
        <h2 className="defText-Col-2 text-center text-3xl title-font font-medium mb-8">
          Email Verification
        </h2>
        <p className="defText-Col-2 text-center leading-relaxed text-base">
          We've sent the confirmation code to your email<br></br>
          <span className="text-center font-medium">
            {authRegisterState.email_address}
          </span>
        </p>
      </div>
      <div className="flex sm:justify-center md:justify-center">
        <Label className="pt-4 mt-2 w-full sm:w-7/12 md:w-7/12">
          <div className="flex relative w-full max-w-xl focus-within:text-purple-500">
            <div className="absolute inset-y-0 flex items-center pl-2">
              <HiLockClosed className="w-4 h-4" aria-hidden="true" />
            </div>
            <Input
              className="mt-1 pl-8 font-semibold tracking-widest"
              type="text"
              placeholder="Confirmation Code"
              onChange={(e) => saveCode(e)}
            />
          </div>
          {!codeStatus && (
            <Alert type="danger" className="mt-4 text-xs">
              {codeError}
            </Alert>
          )}
          <div className="flex justify-center">
            <Button
              onClick={finalSignup}
              className="mt-4 rounded-md defBackground hover:bg-green-500"
              block
            >
              Confirm
            </Button>
          </div>
        </Label>
      </div>
      <div className="mt-5">
        <p className="text-center text-gray-400 leading-relaxed text-base">
          Didn't receive a code?
        </p>
        <p onClick={ resend } className="text-center cursor-pointer text-blue-500 text-base">
          Resend
        </p>
      </div>
    </div>
  );
};

export default withRouter(RegistrationConfirm);
