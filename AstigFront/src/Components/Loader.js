import React from "react";

import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { useSelector } from "react-redux";

const Loader = () => {
  const loaderState = useSelector((state) => state.ui.loader);

  return (
    <>
      {loaderState.state && (
        <div className="pt-4 flex justify-center items-center space-x-1 text-sm text-green-600">
          <AiOutlineLoading3Quarters className="w-4 h-4 animate-spin " />
          <div>{loaderState.message}</div>
        </div>
      )}
    </>
  );
};

export default Loader;
