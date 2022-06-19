import React from "react";
import { withRouter } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { Label, Input, Button } from "@windmill/react-ui";
import { HiLockClosed } from "react-icons/hi";
import {
  setSignInTwoFactor,
  cleanSignInCredential,
} from "../../Features/authSlice";
import { closeInputModal, openAlertModal } from "../../Features/uiSlice";

import API from "../../Helpers/api";
import { saveAuth } from "../../Helpers/uitils"
import { signin } from "../../Features/userSlice";

const TwoFactorAuthConfirm = (props) => {
  const dispatch = useDispatch();
  const signInData = useSelector((state) => state.auth.signin);

  const resend = async () => {
    try {
      const response = await API.post(
        "/auth/signin",
        {
          email_address: signInData.email_address,
          password: signInData.password,
          oauth: false,
        },
        { withCredentials: true }
      );
    } catch (error) {
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

  const checkTwoFactorCode = async () => {
    try {
      const response = await API.post("/auth/signin", signInData);

      const userData = response.data.userData;
      localStorage.setItem("userData", JSON.stringify(userData));
      saveAuth(response)
      dispatch(cleanSignInCredential());
      dispatch(signin(userData));
      dispatch(closeInputModal());
      props.history.push("/");
    } catch (error) {
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


  const saveCode = (e) => {
    dispatch(setSignInTwoFactor({ twoFactCode: e.target.value }));
  };

  return (
    <div>
      <div className="flex-grow">
        <h2 className="defText-Col-2 text-center text-3xl title-font font-medium mb-8">
          Two Factor Authentication Required
        </h2>
        <p className="defText-Col-2 text-center leading-relaxed text-base">
          We've sent your two factor authentication code to your email<br></br>
          <span className="text-center font-medium">
            {signInData.email_address}
          </span>
        </p>
      </div>
      <div className="flex sm:justify-center md:justify-center">
        <Label className="pt-4 mt-2 w-full sm:w-7/12 md:w-7/12">
          <div className="flex relative w-full max-w-xl focus-within:text-teal-700">
            <div className="absolute inset-y-0 flex items-center pl-2">
              <HiLockClosed className=" w-4 h-4 text-teal-700" aria-hidden="true" />
            </div>
            <Input
              className="my-2 pl-8 mr-1 rounded-lg border-0 bg-gray-100 transition duration-500 text-gray-400 hover:text-gray-700 focus:text-gray-700"
              type="text"
              placeholder="Confirmation Code"
              onChange={(e) => saveCode(e)}
            />
          </div>
          <div className="flex justify-center">
            <Button
              onClick={checkTwoFactorCode}
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
        <p
          onClick={resend}
          className="text-center cursor-pointer text-blue-500 text-base"
        >
          Resend
        </p>
      </div>
    </div>
  );
};

export default withRouter(TwoFactorAuthConfirm);
