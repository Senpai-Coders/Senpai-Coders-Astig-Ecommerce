import React, { useState } from "react";

import HelperLabel from "../HelperLabel";
import API from "../../Helpers/api";
import { getAuth } from "../../Helpers/uitils"

import { useDispatch, useSelector } from "react-redux";
import { Button } from "@windmill/react-ui";

import Informative from "../Modal/Informative";
import { closeInputModal, openAlertModal } from "../../Features/uiSlice";
import { signin } from "../../Features/userSlice"

const AvatarChoser = ( { onSave } ) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);
  const avatars = [
    "https://cdn.discordapp.com/attachments/912411399458795593/936870863532359711/unknown.png",
    "https://cdn.discordapp.com/attachments/912411399458795593/936870863901442078/unknown.png",
    "https://cdn.discordapp.com/attachments/912411399458795593/936870864786452490/unknown.png",
    "https://cdn.discordapp.com/attachments/912411399458795593/936870864186642432/unknown.png",
    "https://cdn.discordapp.com/attachments/912411399458795593/936870864580927538/unknown.png",
    "https://cdn.discordapp.com/attachments/912411399458795593/936870865012916224/unknown.png",
    "http://pic1.mangapicgallery.com/r/essay/95/md_/1557110_11890403.jpeg"
  ];
  const [selectedAvatar, setSelectedAvatar] = useState("");

  const updateAvatar = async (avatar) => {
    try {
      const update = await API.post("/user/changeAvatar", {
        _id: userData._id,
        avatar: selectedAvatar,
        auth : getAuth()
      });
      onSave()
      dispatch(closeInputModal());
    } catch (e) {
        console.log(e)
      dispatch(
        openAlertModal({
          component: <Informative />,
          data: {
            description: "Can't save changes",
            solution: "Try again later",
          },
        })
      );
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl">Choose Avatar</h1>
      <HelperLabel
        isError={false}
        bg={"bg-teal-50"}
        txtbg={"text-teal-600"}
        msg={
          "If you have signed up via google. Your photo will be use as your avatar. Once you replaced it with the avatar here, you cannot use your google profile picture again"
        }
      />
      <div className="flex mx-4 my-4 overflow-x-auto py-8 px-5 border-4 border-teal-200 rounded-md">
        {avatars.map((avatar, idx) => (
          <img
            onClick={() => setSelectedAvatar(avatar)}
            key={idx}
            className={`rounded-full w-4/12 h-4/12 md:w-4/12 md:h-4/12 mx-4 ${
              selectedAvatar === avatar
                ? "border-teal-600 h-6/12 w-6/12 border-8 "
                : "border-4 hover:border-teal-400"
            }`}
            src={avatar}
            alt="avatar"
          ></img>
        ))}
      </div>
      <Button
        className="rounded-lg w-full mt-4"
        disabled={selectedAvatar.length === 0}
        onClick={() => updateAvatar()}
      >
        Save
      </Button>
    </div>
  );
};

export default AvatarChoser;
