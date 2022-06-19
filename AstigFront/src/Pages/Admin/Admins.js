import React, { useState, useEffect } from "react";

import { useSelector } from "react-redux";
import ProtectedLoader from "../../Components/ProtectedLoader";

import API from "../../Helpers/api";
import { getAuth } from "../../Helpers/uitils"

import { IoShieldSharp } from "react-icons/io5";
import { BsFillShieldLockFill } from "react-icons/bs";
import { VscAdd } from "react-icons/vsc";
import { RiCloseLine } from "react-icons/ri";

import AdminProfile from "../../Components/ModalComponent/Admin/AdminProfile";
import AdminCreator from "../../Components/ModalComponent/Admin/AdminCreator";

import { useDispatch } from "react-redux";
import { openInputModal, openNotifier } from "../../Features/uiSlice";

import { getTickUpdate } from "../../Helpers/uitils";

const Admins = () => {
  const adminData = useSelector((state) => state.admin.adminData);
  const [loadingData, setLoadingData] = useState(true);
  const [unmounted, setUnmounted] = useState(false);
  const [admin, setAdmin] = useState([]);

  const dispatch = useDispatch();

  const loadSomething = async () => {
    if (adminData) {
      try {
        const response = await API.post("/admin/admins", { auth : getAuth() });
        if (unmounted) return;
        setAdmin(response.data.admins);
        setLoadingData(false);
      } catch (e) {}
    }
  };

  const getPermission = (_id) => {
    if (adminData.role === "Root Admin") return false;
    if (adminData._id !== _id) return true;
  };

  const deleteAdmin = async (adminUser) => {
    const update = await API.post(
      "/admin/updateAdmin",
      {
        _id: adminData._id,
        mode: -1,
        info: {
          ...adminUser,
        },
        auth : getAuth()
      }
    );
    loadSomething();
  }

  useEffect(() => {
    setLoadingData(true);
    loadSomething();
    const interval = setInterval(() => {
      loadSomething();
    }, getTickUpdate());

    return () => {
      setUnmounted(true);
      clearInterval(interval);
    };
  }, [adminData]);

  return (
    <div className="h-screen w-full bg-gray-50 ">
      <div>
        <section className="bg-white dark:bg-gray-900">
          <div className="container h-screen px-6 py-10 mx-auto">
            <h1 className="text-3xl  text-center text-gray-800 capitalize lg:text-4xl dark:text-white">
              Astig03 Admins
            </h1>

            <p className="max-w-2xl mx-auto my-6 text-center text-gray-500 dark:text-gray-300">
              Astig03 admins that make the online store possible & updated
            </p>

            {loadingData && <ProtectedLoader />}
            <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-16 md:grid-cols-2 xl:grid-cols-4 pb-4">
              {!loadingData && (
                <div
                  onClick={() => {
                    dispatch(
                      openInputModal({
                        title: "",
                        component: (
                          <AdminCreator
                            onUpdateSomething={loadSomething}
                            editor_id={adminData._id}
                          />
                        ),
                        onAccept: () => {},
                        acceptBtnText: "Save",
                        cancelBtnText: "Cancel",
                      })
                    );
                  }}
                  className="flex items-center text-gray-500 hover:text-gray-600 transition-colors transform border-2 border-cool-gray-200 border-dashed cursor-pointer rounded-xl hover:border-teal-300 group bg-gray-100 hover:bg-gray-200 dark:border-gray-700 dark:hover:border-transparent"
                >
                  <div className="m-auto">
                    <VscAdd className="object-cover w-10 h-10 mx-auto  ring-cool-gray-400" />

                    <h1 className="mt-4  font-quicksand font-medium capitalize dark:text-white group-hover:text-white">
                      Create New Admin
                    </h1>
                  </div>
                </div>
              )}
              {!loadingData &&
                admin.map((adminUser, idx) => (
                  <div
                    key={idx}
                    className="flex relative flex-col items-center text-gray-600 hover:text-white p-8 transition-colors duration-200 transform border cursor-pointer rounded-xl hover:border-transparent group hover:bg-teal-500 dark:border-gray-700 dark:hover:border-transparent"
                    onClick={() => {
                      dispatch(
                        openInputModal({
                          title: "",
                          component: (
                            <AdminProfile
                              onUpdateSomething={loadSomething}
                              editor_id={adminData._id}
                              admin_id={adminUser._id}
                              uneditable={getPermission(adminUser._id)}
                            />
                          ),
                          onAccept: () => {},
                          acceptBtnText: "Save",
                          cancelBtnText: "Cancel",
                        })
                      );
                    }}
                  >
                    {adminData.role === "Root Admin" && adminData._id !== adminUser._id && (
                      <RiCloseLine
                        className="absolute top-2 right-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(
                            openNotifier({
                              title: "Remove Admin",
                              message: `You are about to remove this admin, this admin won't be able to manage Astig03 anymore`,
                              onAccept: () => {
                                deleteAdmin(adminUser)
                              },
                              acceptBtnText: "Yes, Remove It",
                              cancelBtnText: "Cancel",
                            })
                          );
                        }}
                      />
                    )}
                    
                    <img
                      className="object-cover w-32 h-32 rounded-full ring-2 ring-cool-gray-400"
                      src={adminUser.profile_picture}
                      alt=""
                    />

                    <h1 className="mt-4 text-2xl font-quicksand font-medium capitalize dark:text-white group-hover:text-white">
                      {adminUser.name}
                    </h1>

                    <div className="flex mt-3 -mx-2 space-x-2 items-center">
                      {adminUser.role !== "Admin" ? (
                        <BsFillShieldLockFill />
                      ) : (
                        <IoShieldSharp />
                      )}
                      <p className=" capitalize dark:text-gray-300 group-hover:text-gray-300">
                        {adminUser.role}
                      </p>
                      {
                        adminData._id === adminUser._id && <p  className="text-sm text-center font-medium" >(You)</p>
                    }
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Admins;
