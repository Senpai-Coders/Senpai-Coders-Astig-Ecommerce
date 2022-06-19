import React from 'react';
import {AiOutlineLoading} from 'react-icons/ai'


const Loader = () => {
  return <div className="flex justify-center bg-white items-center h-32">
        <AiOutlineLoading className="filter transition animate-spin duration-500 hover:text-teal-300 w-6 h-6 text-teal-500" />
    </div>
};

export default Loader;
