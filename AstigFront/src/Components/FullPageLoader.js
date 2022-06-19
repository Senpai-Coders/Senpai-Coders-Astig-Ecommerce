import React from "react";
import { AiOutlineLoading } from "react-icons/ai";

const FullPageLoader = () => {
  return (
    <div className="m-auto h-full flex items-center">
      <AiOutlineLoading className="text-teal-600 filter  animate-spin  m-auto" />
    </div>
  );
};

export default FullPageLoader;
