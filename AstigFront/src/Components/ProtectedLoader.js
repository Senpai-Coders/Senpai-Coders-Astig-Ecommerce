import React from 'react'
import {AiOutlineLoading} from 'react-icons/ai'

const ProtectedLoader = () => {
    return (
    <div className="flex justify-center bg-white items-center">
        <AiOutlineLoading className="fixed top-2/4 filter transition animate-spin duration-500 hover:text-teal-300 w-6 h-6 text-teal-500 m-auto" />
    </div>
    )
}

export default ProtectedLoader
