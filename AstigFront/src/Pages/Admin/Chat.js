import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import ProtectedLoader from "../../Components/ProtectedLoader";

import API from "../../Helpers/api";
import { getAuth, getChatTick } from "../../Helpers/uitils";

import LiveChat from "../../Pages/Admin/LiveChatDetails";

import { RiMessage3Fill } from "react-icons/ri";
import { AiFillDelete } from "react-icons/ai";
import { AnimatePresence, motion } from "framer-motion";

import { openNotifier } from "../../Features/uiSlice";

import Loader from "../../Components/admin/Loader";

const Chat = () => {
  const dispatch = useDispatch();
  const adminData = useSelector((state) => state.admin.adminData);
  const [loadingData, setLoadingData] = useState(true);
  const [conversations, setConversation] = useState([]);
  const [unmounted, setUnmounted] = useState(false);
  const [selConv, setSelConv] = useState(-1);

  const [choosing, setChoosing] = useState(false);

  const deleteConversation = async (user_id) => {
    try {
      const res = API.post("/admin/deleteConversation", {
        user_id,
        auth : getAuth()
      });
    } catch (e) {}
  };

  const seenConvo = (copy, user_id, idx) => {
    setChoosing(true);
    setSelConv(-1);
    const res = API.post("/admin/seenConversation", { user_id, auth : getAuth() });

    setChoosing(false);
    setSelConv(idx);
  };

  useEffect(() => {
    const loadSomething = async () => {
      try {
        console.log("REQUESTING UPDATES");
        const response = await API.post("/admin/getChat", {auth : getAuth() });
        setConversation(response.data.conversations);
        setLoadingData(false);
        setChoosing(false);
      } catch (e) {
        console.log(e);
      }
    };

    loadSomething(-1);

    const interval = setInterval(() => {
      loadSomething();
    }, getChatTick());

    return () => {
      clearInterval(interval);
      setUnmounted(true);
    };
  }, [adminData]);

  const getProperIndex = (selVal) => {
    if (conversations.length <= selVal)
      if (conversations.leng === 0) {
        setSelConv(-1);
        return -1;
      } else {
        setSelConv(0);
        return 0;
      }
    return selVal;
  };

  return (
    <div className="w-full h-full bg-white ">
      {!adminData ? (
        <ProtectedLoader />
      ) : (
        <div className="w-full" style={{ minHeight: "90vh" }}>
          <div
            className="grid grid-cols-4 border rounded "
            style={{ minHeight: "90vh" }}
          >
            <div className="col-span-1 bg-white border-r border-gray-100 ">
              <ul className="overflow-y-auto ">
                <h2 className="ml-2 mb-2 text-gray-600 text-lg my-2">Chat</h2>
                <AnimatePresence>
                  {conversations.map((customer, idx) => (
                    <motion.li
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={idx}
                      onClick={() => {
                        seenConvo(customer, customer.user_id, idx);
                      }}
                    >
                      <div className="relative bg-gray-50 border-gray-100 px-3 py-2 cursor-pointer flex items-center text-sm focus:outline-none focus:border-gray-100 transition duration-150 ease-in-out">
                        <img
                          src={customer.profile_info.profile_picture}
                          alt=""
                          className={`w-8 h-8 rounded-full ${
                            customer.hasNewMessage &&
                            "animate-pulse ring-2 ring-blue-400"
                          }`}
                        />
                        <div className="">
                          <div className="hidden lg:flex justify-between ">
                            <span className="block ml-2  text-base text-gray-600 ">
                              {customer.profile_info.user_name}
                            </span>
                          </div>
                        </div>
                        {customer.hasNewMessage && (
                          <div className="flex items-center absolute right-4 text-xs text-blue-500 ">
                            <p className="hidden sm:block order-2 ml-2">
                              New Message
                            </p>{" "}
                            <RiMessage3Fill className="h-6 w-6 animate-pulse" />
                          </div>
                        )}
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
                {!loadingData ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="text-center col-span-3 h-full py-24 text-xs text-gray-500"
                  >
                    {!loadingData &&
                      conversations.length === 0 &&
                      "No Customer Conversation"}
                  </motion.div>
                ) : (
                  <Loader />
                )}
              </ul>
            </div>
            {conversations.length > 0 && (
              <AnimatePresence>
                {getProperIndex(selConv) !== -1 &&
                selConv < conversations.length ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`h-full col-span-3 bg-white relative`}
                  >
                    <div className="relative flex items-center border-b border-gray-100 pl-3 py-3">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={
                          conversations[selConv].profile_info.profile_picture
                        }
                        alt="username"
                      />
                      <span className="block ml-2 font-bold text-base text-gray-600">
                        {conversations[selConv].profile_info.user_name}
                      </span>
                      <AiFillDelete
                        className="cursor-pointer transition duration-150 hover:text-red-500 text-red-400 h-6 w-6 absolute right-8"
                        data-bs-toggle="tooltip"
                        data-bs-placement="bottom"
                        title="Delete Conversation"
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(
                            openNotifier({
                              title: "Remove Conversation?",
                              message: `You are about to delete this conversation forever`,
                              onAccept: () => {
                                deleteConversation(
                                  conversations[selConv].user_id
                                );
                              },
                              acceptBtnText: "Yes, Remove Forever",
                              cancelBtnText: "Cancel",
                            })
                          );
                        }}
                      />
                    </div>
                    <LiveChat
                      adminData={adminData}
                      messages={conversations[selConv].messages}
                      userId={conversations[selConv].user_id}
                      profile_info={conversations[selConv].profile_info}
                    />
                    
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center col-span-3 h-full py-24 text-xs text-gray-500"
                  >
                    {selConv !== -1 || choosing ? (
                      <Loader />
                    ) : (
                      "No Selected Covnersation"
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
