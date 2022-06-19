/* Deps */
import React, { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownItem,
  Avatar,
} from "@windmill/react-ui";
import { withRouter } from "react-router-dom";

/* Icons */
import { AiOutlineUser } from "react-icons/ai";
import { MdOutlineLogout, MdHelpCenter } from "react-icons/md";
import { HiMenuAlt2 } from "react-icons/hi"

/*redux */
import { useSelector, useDispatch } from "react-redux";

/* userSlice */
import { adminOut, adminSign } from "../Features/adminSlice";
import { openNotifier } from "../Features/uiSlice";

import Loader from "../Components/Loader";

import { openInputModal } from "../Features/uiSlice";
import AdminProfile from "../Components/ModalComponent/Admin/AdminProfile";

import API from "../Helpers/api"
import { getAuth } from "../Helpers/uitils"

const AdminHeader = (props) => {
  const { history } = props;
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const dispatch = useDispatch();

  //current user
  const adminData = useSelector((state) => state.admin.adminData);
  const appState = useSelector((state) => state.app.appState);

  const reloadAdminData = async () => {
    try {
      let savedAdmin = JSON.parse(localStorage.getItem("adminData"));
      const adminResponse = await API.post(`/admin/mydetails/${savedAdmin._id}`, { auth : getAuth() });
      dispatch(adminSign(adminResponse.data.adminData));
    } catch (e) {}
  };

  const signOut = () => {
    dispatch(adminOut());
    props.history.push("/auth/admin_signin");
  };

  useEffect(()=>{
    reloadAdminData()
  },[])

  return (
    <header className="z-40 py-4 bg-white filter shadow-sm dark:bg-gray-800">
      <div className="container flex items-center justify-between h-full px-6 mx-auto text-purple-600 dark:text-purple-300">
        <div className="relative flex items-center"></div>
        <HiMenuAlt2 onClick={(e)=>{
            props.toggleSide(!props.curVal)
            e.stopPropagation()
        }} className="cursor-pointer absolute left-5 h-6 w-6 lg:hidden text-gray-500 hover:text-gray-700 duration-500"/>
        {/* User Avatar */}
        <ul className="flex items-center flex-shrink-0 space-x-6">
          <li className="relative">
            {!adminData ? (
              <Loader />
            ) : (
              <button
                className="rounded-full hover:bg-gray-100 border-2 focus:shadow-outline-purple focus:ring-2 focus:outline-none"
                aria-label="Account"
                aria-haspopup="true"
                onClick={() => setIsProfileMenuOpen(true)}
              >
                {adminData.profile_picture ? (
                  <Avatar
                    className="align-middle"
                    src={adminData.profile_picture}
                    alt=""
                    aria-hidden="true"
                  />
                ) : (
                  <AiOutlineUser className="align-middle defTextCOlorGreen w-5 h-5" />
                )}
              </button>
            )}
            <Dropdown
              className="custom_shadow p-5"
              align="right"
              isOpen={isProfileMenuOpen}
              onClose={() => setIsProfileMenuOpen(false)}
            >
              <h1 className="defTextCol mb-4 font-medium text-base">
                ADMIN
              </h1>
              <DropdownItem
                className="dark:text-gray-200 text-gray-500 bg-gray-50 dark:bg-gray-800 hover:text-green-600"
                tag="a"
                onClick={() => {
                  dispatch(
                    openInputModal({
                      title: "",
                      component: (
                        <AdminProfile
                          onUpdateSomething={reloadAdminData}
                          admin_id={adminData._id}
                          editor_id={adminData._id}
                        />
                      ),
                      onAccept: () => {},
                      acceptBtnText: "Save",
                      cancelBtnText: "Cancel",
                    })
                  );
                }}
              >
                {adminData ? (
                  <div className="flex items-center">
                    <Avatar
                      className="mr-5"
                      src={
                        adminData.profile_picture
                          ? adminData.profile_picture
                          : "https://cdn.discordapp.com/attachments/912411399458795593/921097628446498887/36..04.jpg"
                      }
                      alt=""
                      aria-hidden="true"
                    />
                    <h1>{adminData.name}</h1>
                  </div>
                ) : (
                  <></>
                )}
              </DropdownItem>

              <DropdownItem
                tag="a"
                className="dark:text-gray-200 text-gray-500 hover:text-green-600"
              >
                <MdHelpCenter
                  className="w-5 h-5 mr-5 text-indigo-400"
                  aria-hidden="true"
                />
                <a 
                    rel="noreferrer"
                    target={"_blank"}
                    href="https://senpai-coders.github.io/Senpai-Coders-Astig-Ecommerce/#/./admin/AdminGuide" className=" font-normal">Admin Manual</a>
              </DropdownItem>

              <DropdownItem
                className="text-gray-500  dark:text-gray-200 hover:text-orange-600"
                onClick={() =>
                  dispatch(
                    openNotifier({
                      title: "Sign Out",
                      message:
                        "You are about to be signed out, Do you wish to proceed?",
                      onAccept: () => {
                        signOut();
                      },
                      acceptBtnText: "Yes",
                      cancelBtnText: "No",
                    })
                  )
                }
              >
                <MdOutlineLogout className="w-5 h-5 mr-5" aria-hidden="true" />
                <span className=" font-normal">Signout</span>
              </DropdownItem>
            </Dropdown>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default withRouter(AdminHeader);
