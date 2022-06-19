import React, { useState, useEffect } from "react";

import { getUrl, parseDateTime, getChatTick } from "../../Helpers/uitils";
import API from "../../Helpers/api";
import { getAuth } from "../../Helpers/uitils"

import { RiSendPlaneFill } from "react-icons/ri";
import { AiOutlineLoading } from "react-icons/ai";
import { Textarea } from "@windmill/react-ui";

import Loader from "../admin/Loader";

const Chat = ({ userId, profile_info, yourProfilePicture }) => {
  const [writeMsg, setWriteMsg] = useState("");
  const [loadingData, setLoadingData] = useState(true);
  const [conversation, setConversation] = useState({ messages: [] });
  const [sending, setSending] = useState(false);

  const scrollDown = () => {
    var elem = document.getElementById("messages");
    elem.scrollTop = elem.scrollHeight;
  };

  const loadSomething = async () => {
    try {
      const conversations = await API.post("/user/getChat", {
        _id: userId,
        profile_info,
        auth : getAuth()
      });

      if(conversations.length === conversations.data.conversation) return
      setConversation(conversations.data.conversation);
      setLoadingData(false);

      
    } catch (e) {}
  };

  const send = async () => {
    try {
      setSending(true);
      const response = await API.post("/user/sendMessage", {
        _id: userId,
        profile_info,
        message: {
          type: 0,
          message: writeMsg,
          cat: new Date(),
        },
        auth : getAuth()
      });
      setConversation(response.data.conversation);
      scrollDown();
      setSending(false);
      setWriteMsg("");
    } catch (e) {
        console.log(e)
    }
  };

  useEffect(() => {
    loadSomething();

    const interval = setInterval(() => {
      loadSomething();
    }, getChatTick());

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="h-10/12">
      <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <span className="absolute defTextCol3 right-0 bottom-0">
              <svg width="20" height="20">
                <circle cx="8" cy="8" r="8" fill="currentColor"></circle>
              </svg>
            </span>
            <img
              src={getUrl("/static/assets/logo.jpg")}
              alt=""
              className="w-7 sm:w-12 h-7 sm:h-12 rounded-full"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <div className="text-2xl mt-1 flex items-center">
              <span className="text-gray-700 mr-3">Astig03</span>
            </div>
            <span className="text-md text-gray-600">
              Clothing & Shoes store
            </span>
          </div>
        </div>
      </div>

      <div
        id="messages"
        className="pt-8 flex flex-col space-y-3 p-3 overflow-y-auto max-h-96 scrollbar-thumb- scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
      >
        {loadingData ? (
          <Loader />
        ) : (
          <>
            {conversation.messages.length === 0 && (
              <p className="text-gray-400 text-center py-8 text-xs">
                no conversation
              </p>
            )}
          </>
        )}

        {conversation.messages.map((message, idx) => (
          <div key={idx}>
            <div
              className={`flex  ${
                message.type === 0 ? "justify-end items-end" : "items-end"
              }`}
            >
              <div
                className={`relative flex flex-col space-y-2 text-xs max-w-xs mx-2  ${
                  message.type === 0
                    ? "items-end order-1"
                    : "items-start order-2"
                }`}
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title={parseDateTime(new Date(message.cat))}
              >
                <div className="cursor-default">
                  <span className={`px-4 py-2 rounded-lg inline-block rounded-br-none ${message.type === 0 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"} `}>
                    {message.message}
                  </span>
                </div>

                {idx === 0 ? (
                  <>
                    <p
                      className="absolute font-medium text-gray-500 -top-8"
                      style={{ fontSize: "0.7rem" }}
                    >
                      {message.type === 0 ? (
                        "You"
                      ) : (
                        <>
                          Admin
                        </>
                      )}
                    </p>
                  </>
                ) : (
                  <>
                    {conversation.messages[idx - 1].type !== message.type ? (
                      <>
                        <p
                          className="absolute font-medium text-gray-500 -top-8"
                          style={{ fontSize: "0.7rem" }}
                        >
                          {message.type === 0 ? (
                            "You"
                          ) : (
                            <>
                              Admin
                            </>
                          )}
                        </p>
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                )}
              </div>
              <img
                src={
                  message.type === 0
                    ? yourProfilePicture
                    : message.profile.profile
                }
                alt=""
                className="w-6 h-6 rounded-full order-1"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title={message.type === 0 ? "You" : message.profile.name + ` (${message.profile.role}) `}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex flex-row  items-center  bottom-0 my-2 w-full border-t border-gray-200 pt-4">
        <Textarea
          disabled={loadingData}
          className={`border rounded-2xl border-transparent w-full focus:outline-none text-sm flex items-center scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch ${
            sending && "animate-pulse"
          }`}
          placeholder="Type your message...."
          rows={3}
          value={writeMsg}
          onChange={(e) => {
            if(sending) return
            setWriteMsg(e.target.value);
          }}
          onKeyDown={(e)=>{
            if (e.key === "Enter" && !e.shiftKey && writeMsg.length > 0)
                send()
          }}
        />
        <div>
          <button
            disabled={writeMsg.length === 0 || sending || loadingData}
            onClick={() => send()}
            className={`ml-3 flex items-center justify-center h-10 w-10 mr-2 rounded-full bg-gray-200 hover:bg-gray-300 text-indigo-800 focus:outline-none ${
              writeMsg.length === 0 || sending || loadingData
                ? "opacity-60 cursor-not-allowed"
                : ""
            }`}
          >
            {!sending ? (
              <RiSendPlaneFill className="w-5 h-5 transform rotate-45" />
            ) : (
              <AiOutlineLoading className="h-4 w-4 animate-spin" />
            )}
          </button>
        </div>
        {sending && (
          <p
            className="absolute -bottom-8 animate-pulse"
            style={{ fontSize: "0.8rem" }}
          >
            Sending..
          </p>
        )}
      </div>
    </div>
  );
};

export default Chat;
