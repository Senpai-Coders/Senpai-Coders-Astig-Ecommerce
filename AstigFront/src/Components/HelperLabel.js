import React from "react";
import { AiFillInfoCircle } from "react-icons/ai";


const HelperLabel = ({msg, isError, bg, txtbg}) => {
  return (
    <div className={` ${ !bg? (isError? "bg-red-100": "bg-blue-100") : bg } flex items-center w-full mt-2 rounded-md px-2 py-1`}>
      <AiFillInfoCircle className={!txtbg?(isError? "text-red-600" : "defTextCol" ) : txtbg }/>
      <p className={`ml-2 text-xs ${!txtbg?(isError? "text-red-600" : "defTextCol") : txtbg }`}>
        {msg}
      </p>
    </div>
  );
};

export default HelperLabel;
