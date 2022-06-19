import React, { useState, useEffect } from "react";

import { MdKeyboardArrowDown } from "react-icons/md";
import { Dropdown, DropdownItem, Button } from "@windmill/react-ui";

import { IoShieldSharp } from "react-icons/io5";
import { BsFillShieldLockFill } from "react-icons/bs";

import {closeInputModal, openAlertModal} from "../../../Features/uiSlice"
import Informative from "../../Modal/Informative"
import {useDispatch} from "react-redux"

import HelperLabel from "../../HelperLabel";

import API from "../../../Helpers/api"
import { getAuth } from "../../../Helpers/uitils"

const AdminCreator = ({ onUpdateSomething, editor_id }) => {

  const dispatch = useDispatch()

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Admin");

  const [isOpen, setIsOpen] = useState(false);


  const saveAdmin = async () => {
    try{

        const response = await API.post("/admin/updateAdmin",{
            _id : editor_id, mode : 0, info : {
                name, email_address : email, password, role
            },
            auth : getAuth()
        })

        onUpdateSomething()
        dispatch(closeInputModal())
    }catch(error){
        if (error.response){
            dispatch(
              openAlertModal({
                component: <Informative />,
                data: {
                  description: error.response.data.description,
                  solution: error.response.data.solution,
                },
              })
            );
            return
          }
          dispatch(
            openAlertModal({
              component: <Informative />,
              data: {
                description: "We can't reach the server",
                solution: "Please try again later",
              },
            })
          );
    }
  }

  return (
    <div>
      <p className="mt-2 mb-4 text-xl font-medium">New Admin</p>
      <div>
        <label className="text-gray-700 dark:text-gray-200">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          className="block w-full px-2 py-1 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-teal-400 focus:ring-teal-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
        />
      </div>

      <div className="mt-4">
        <label className="text-gray-700 dark:text-gray-200">
          Email Address
        </label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full px-2 py-1 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-teal-400 focus:ring-teal-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
        />
      </div>

      <div className="mt-4 flex items-center">
        <div className="w-full">
          <label className="text-gray-700 dark:text-gray-200">Role</label>
          <input
            type="text"
            value={role}
            disabled={true}
            className="block w-full px-2 py-1 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-teal-400 focus:ring-teal-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
          />
        </div>
        <button
          onClick={() => {
            setIsOpen(true);
          }}
          className="mt-6 ml-1 px-2 py-1 w-2/6 text-white hover:bg-teal-400 block  bg-teal-500 border border-gray-50 rounded-md dark:text-white focus:border-teal-500 focus:ring-opacity-40 dark:focus:ring-opacity-40 focus:ring-teal-300 dark:focus:ring-teal-400 focus:ring dark:bg-gray-800 focus:outline-none"
        >
          Choose Role
        </button>
        <div className="relative right-14 mx-2 my-auto h-full">
          <Dropdown
            align="right"
            isOpen={isOpen}
            onClose={() => {
              setIsOpen(false);
            }}
          >
            <DropdownItem onClick={() => setRole("Admin")}>
              <div className="flex items-center">
                <IoShieldSharp className="mr-5" />
                <span>Admin</span>
              </div>
            </DropdownItem>
            <DropdownItem onClick={() => setRole("Root Admin")}>
              <div className="flex justify-between items-center">
                <BsFillShieldLockFill className="mr-5" />
                <span>Root Admin</span>
              </div>
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="mt-4">
        <label className="text-gray-700 dark:text-gray-200">Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="tracking-widest block w-full px-2 py-1 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-teal-400 focus:ring-teal-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
        />
      </div>

      <div className="mx-auto ">
        {!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password) &&
        password !== "" ? (
          <HelperLabel
            isError={true}
            msg={
              "We recomend that your password contain more than 8 characters with Uppercase, Lowercase Symbols, & Numbers "
            }
          />
        ) : (
          ""
        )}
      </div>
      
      <Button
        disabled={name.length === 0 || email.length === 0 || password === 0}
        className="bg-teal-400 mt-8 text-white w-full rounded-md"
        onClick={() => saveAdmin() }
      >
        Save
      </Button>
    </div>
  );
};

export default AdminCreator;
