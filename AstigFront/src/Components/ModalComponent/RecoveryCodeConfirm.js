import React from "react";
import { Label, Input, Button } from "@windmill/react-ui";
import { HiLockClosed } from "react-icons/hi";
import { withRouter} from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { setRecoveryCode, clearRecovery } from "../../Features/authSlice";
import { openAlertModal , closeInputModal } from "../../Features/uiSlice";
import { signin } from '../../Features/userSlice'

import API from '../../Helpers/api'
import { saveAuth } from "../../Helpers/uitils"

const RecoveryCodeConfirm = (props) => {

  const recoveryState = useSelector((state) => state.auth.recovery);
  const dispatch = useDispatch();

  const saveCode = (e) => {
    let recovery_code = e.target.value;
    dispatch(setRecoveryCode({ recovery_code }));
  };

  const finalSignup =  async () => {
    try {
        console.log(recoveryState)
        const response = await API.post("/auth/recover", recoveryState);
  
        const userData = response.data.userData

        localStorage.setItem("userData", JSON.stringify(userData));
        saveAuth(response)

        dispatch(clearRecovery())
        dispatch(signin(userData))
        dispatch(closeInputModal())
        props.history.push("/")
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

  return (
    <div>
      <div className="flex-grow">
        <h2 className="defText-Col-2 text-center text-3xl title-font font-medium mb-8">
          Recovery Code
        </h2>
        <p className="defText-Col-2 text-center leading-relaxed text-base">
          We've sent the recovery code to your email<br>
          </br>
          <span className="text-center font-medium">
            {recoveryState.email_address}
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
              placeholder="Recovery Code"
              onChange={(e) => saveCode(e)}
              />
          </div>
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
        <p className="text-center cursor-pointer text-blue-500 text-base">
          Resend
        </p>
      </div>
    </div>
  );
};

export default withRouter(RecoveryCodeConfirm);
