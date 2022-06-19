/* Deps */
import React, { useEffect, useState } from "react";
import {
  Input,
  Dropdown,
  DropdownItem,
  Avatar,
  Button,
} from "@windmill/react-ui";
import { withRouter, Link, useLocation } from "react-router-dom";

/* Icons */
import { RiCloseLine } from "react-icons/ri";
import { BiSearch } from "react-icons/bi";
import { AiOutlineUser, AiFillFire, AiFillShopping } from "react-icons/ai";
import { BsGearFill, BsHeartFill, BsHeart, BsFillInfoCircleFill } from "react-icons/bs";
import { ImCart } from "react-icons/im";
import {
  MdOutlineLogout,
  MdQuestionAnswer,
  MdHelpCenter,
} from "react-icons/md";
import { GoPackage } from "react-icons/go";
import { IoChatbubblesSharp } from "react-icons/io5";
import { VscMenu } from "react-icons/vsc";

/*redux */
import { useSelector, useDispatch } from "react-redux";
import { setUserSearch, setData } from "../Features/appSlice";

/* userSlice */
import { signout } from "../Features/userSlice";
import { openNotifier } from "../Features/uiSlice";
import { openInputModal } from "../Features/uiSlice";

import Chat from "../Components/ModalComponent/Chat";
import Favorites from "../Components/ModalComponent/Favorites";

import API from "../Helpers/api";

const Header = (props) => {
  const { history, mobBar, setMobBar } = props;
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const dispatch = useDispatch();

  //current user
  const _cur_user = useSelector((state) => state.user);
  const appState = useSelector((state) => state.app.appState);

  const signOut = () => {
    dispatch(signout());
    props.history.push("/");
  };

  const toggleMyCart = () => {
    if (!_cur_user.hasUser) {
      dispatch(
        openNotifier({
          title: "No User",
          message: "Please Sign In First",
          onAccept: () => {
            history.push("/auth/signin");
          },
          acceptBtnText: "Sign In",
          cancelBtnText: "No, Thanks",
        })
      );
      return;
    }

    // else continue to cart page
    history.push("/user/mycart");
  };

  const onSearchEnter = async (event) => {
    if (event.key === "Enter") {
      setMobBar(false)
      props.history.push("/products");
      try {
        const req = await API.post("/browse/getproduct", appState);
        dispatch(setData({ data: req.data.products }));
      } catch (e) {
        console.log("ERR", e);
      }
    }
  };

  useEffect(() => {}, []);

  return (
    <>
      <div
        onClick={(e)=> e.stopPropagation()}
        className={`md:hidden duration-700 w-8/12 sm:5/12 h-screen z-40 fixed mt-14 top-0 p-4 bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg  ${
          mobBar ? "left-0 opacity-100" : "-left-96 opacity-0"
        }`}
      >
        <RiCloseLine
          onClick={() => {setMobBar(false) }}
          className="w-6 h-6 cursor-pointer absolute right-0 mr-4 "
        />
        <p className="mt-4 mb-2" >Menu & Navigation</p>
        <div className="sm:hidden flex-1">
          <div className="relative text-green-900 h-full focus-within:text-green-700 ">
            <div className="absolute inset-y-0 flex items-center pl-2">
              <BiSearch className="w-4 h-4" aria-hidden="true" />
            </div>
            <Input
              className=" pl-8 rounded-lg bg-gray-100 border transition duration-500 text-gray-400 hover:text-gray-700 focus:text-gray-700"
              placeholder="Search Product"
              aria-label="Search"
              onChange={(e) => {
                dispatch(setUserSearch({ userSearch: e.target.value }));
              }}
              onKeyDown={onSearchEnter}
            />
          </div>
        </div>
        <div className=" text-gray-400 flex flex-col my-6 space-y-3">
            <h3
              onClick={() => history.push("/")}
              className={
                (useLocation().pathname === "/" ? "defTextCol" : "") +
                " cursor-pointer text-sm flex hover:text-red-900 items-center"
              }
            >
              <AiFillFire className="w-6 h-6 pr-2" aria-hidden="true" />
              <p className=" transition duration-200 ease-linear">
                Home
              </p>
            </h3>

            <h3
              onClick={() => history.push("/products")}
              className={
                (useLocation().pathname === "/products"
                  ? "defTextCol"
                  : "") +
                " cursor-pointer text-sm flex hover:defTextCol items-center"
              }
            >
              <AiFillShopping className="w-6 h-6 pr-2" aria-hidden="true" />
              <p className=" transition duration-200 ease-linear">
                Products
              </p>
            </h3>

            <h3
              onClick={() => history.push("/faqs")}
              className={
                (useLocation().pathname === "/faqs" ? "defTextCol" : "") +
                " cursor-pointer text-sm flex hover:defTextCol"
              }
            >
              <MdQuestionAnswer className="w-6 h-6 pr-2" aria-hidden="true" />
              <p className="transition duration-200 ease-linear">
                FAQs
              </p>
            </h3>

            <h3
              onClick={() => history.push("/about")}
              className={
                (useLocation().pathname === "/about" ? "defTextCol" : "") +
                " cursor-pointer text-sm flex hover:defTextCol items-center "
              }
            >
              <BsFillInfoCircleFill className="w-6 h-6 pr-2" aria-hidden="true" />
              <p className=" transition duration-200 ease-linear">
                About
              </p>
            </h3>
          </div>
      </div>

      {/** Normal Nav for Desktop Tablet XDXD */}
      <header className="HHeader fixed bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg top-0 w-full z-40 py-3 bg-whie shadow-bottom dark:bg-gray-800 border-b-2 borderDefCol md:px-6">
        <div className="relative container flex items-center justify-evenly h-full px-6 mx-auto text-purple-600 dark:text-purple-300">
          <VscMenu
            onClick={(e) => {setMobBar(true); e.stopPropagation() }}
            className="cursor-pointer w-6 h-6 pr-2 md:hidden defTextCol"
            aria-hidden="true"
          />
          <a
            className="font-inter defTextCOlorBlack ml-6 text-sm md:text-lg text-gray-800 dark:text-gray-200"
            href="/"
          >
            Astig03
          </a>

          {/* <!-- Search input --> */}
          <div className=" hidden sm:flex flex-1 ml-8 lg:mr-8 ">
            <div className="relative text-green-900 h-full md:w-7/12  focus-within:text-green-700 ">
              <div className="absolute inset-y-0 flex items-center pl-2">
                <BiSearch className="w-4 h-4" aria-hidden="true" />
              </div>
              <Input
                className="pl-8 rounded-lg border-0 bg-gray-100 transition duration-500 text-gray-400 hover:text-gray-700 focus:text-gray-700"
                placeholder="Search Product"
                aria-label="Search"
                onChange={(e) => {
                  dispatch(setUserSearch({ userSearch: e.target.value }));
                }}
                onKeyDown={onSearchEnter}
              />
            </div>
          </div>

          {/* <!-- Embedded Routes --> */}
          <div className="flex text-gray-400 items-center justify-start flex-1">
            <h3
              onClick={() => history.push("/")}
              className={
                (useLocation().pathname === "/" ? "defTextCol" : "") +
                " cursor-pointer text-sm flex hover:text-red-900 items-center py-2 mx-1 md:mx-4"
              }
            >
              {/* <AiFillFire className="w-6 h-6 pr-2" aria-hidden="true" /> */}
              <p className="hidden md:block transition duration-200 ease-linear">
                Home
              </p>
            </h3>
            <h3
              onClick={() => history.push("/products")}
              className={
                (useLocation().pathname === "/products"
                  ? "defTextCol"
                  : "") +
                " cursor-pointer text-sm flex hover:defTextCol items-center mx-1 md:mx-4"
              }
            >
              {/* <AiFillShopping className="w-6 h-6 pr-2" aria-hidden="true" /> */}
              <p className="hidden md:block transition duration-200 ease-linear">
                Products
              </p>
            </h3>
            <h3
              onClick={() => history.push("/faqs")}
              className={
                (useLocation().pathname === "/faqs" ? "defTextCol" : "") +
                " cursor-pointer text-sm flex hover:defTextCol items-center mx-1 md:mx-4"
              }
            >
              {/* <MdQuestionAnswer className="w-6 h-6 pr-2" aria-hidden="true" /> */}
              <p className="hidden md:block transition duration-200 ease-linear">
                FAQs
              </p>
            </h3>
            <h3
              onClick={() => history.push("/about")}
              className={
                (useLocation().pathname === "/about" ? "defTextCol" : "") +
                " cursor-pointer text-sm flex hover:defTextCol items-center mx-4"
              }
            >
              {/* <BsFillInfoCircleFill className="w-6 h-6 pr-2" aria-hidden="true" /> */}
              <p className="hidden md:block transition duration-200 ease-linear">
                About
              </p>
            </h3>
          </div>

          {/* User Avatar */}
          <ul className="flex items-center flex-shrink-0 space-x-6">
            <li className="flex">
              <button
                className="relative align-middle rounded-md focus:outline-none focus:shadow-outline-purple"
                onClick={toggleMyCart}
                aria-label="Notifications"
                aria-haspopup="true"
              >
                <ImCart
                  className="w-5 h-5  defTextCol"
                  aria-hidden="true"
                />
                {_cur_user.hasUser && _cur_user.userData.cart.total_items > 0 && (
                  <span
                    aria-hidden="true"
                    className="absolute top-0 right-0 inline-block w-5 h-5 transform translate-x-3 -translate-y-3 bg-red-600 border-2 text-white border-white rounded-full dark:border-gray-800"
                  >
                    <p className="text-white text-xs">
                      {_cur_user.userData.cart.total_items}
                    </p>
                  </span>
                )}
              </button>
            </li>
            <li className="flex">
              <button
                className="relative align-middle rounded-md focus:outline-none focus:shadow-outline-purple"
                onClick={() => {
                  if (!_cur_user.hasUser) {
                    dispatch(
                      openNotifier({
                        title: "No User",
                        message: "Please Sign In First",
                        onAccept: () => {
                          history.push("/auth/signin");
                        },
                        acceptBtnText: "Sign In",
                        cancelBtnText: "No, Thanks",
                      })
                    );
                    return;
                  }

                  dispatch(
                    openInputModal({
                      title: "Liked Products",
                      component: <Favorites _id={_cur_user.userData._id} />,
                      onAccept: () => {},
                      acceptBtnText: "Send",
                      cancelBtnText: "Cancel",
                    })
                  );
                }}
                aria-label="Notifications"
                aria-haspopup="true"
              >
                <BsHeart
                  className="w-5 h-5 defTextCol"
                  aria-hidden="true"
                />
                
              </button>
            </li>
            <li className="relative">
              {!_cur_user.hasUser ? (
                <div className="flex space-x-3 justify-evenly">
                  <Button
                    className="rounded-none cursor-pointer focus:outline-none focus:ring "
                    block
                    tag={Link}
                    to="/auth/signin"
                  >
                    Login
                  </Button>
                </div>
              ) : (
                <button
                  className="rounded-full hover:bg-gray-100 border-2 borderDefCol focus:shadow-outline-purple focus:ring-2 focus:outline-none"
                  aria-label="Account"
                  aria-haspopup="true"
                  onClick={() => setIsProfileMenuOpen(true)}
                >
                  {_cur_user.userData.profile_picture ? (
                    <Avatar
                      className="align-middle"
                      src={_cur_user.userData.profile_picture}
                      alt=""
                      aria-hidden="true"
                    />
                  ) : (
                    <AiOutlineUser className="align-middle defTextCol w-5 h-5" />
                  )}
                </button>
              )}
              <Dropdown
                className="backdrop-filter backdrop-blur-lg p-5"
                align="right"
                isOpen={isProfileMenuOpen}
                onClose={() => setIsProfileMenuOpen(false)}
              >
                <DropdownItem
                  className="defBgLighter"
                  tag="a"
                  onClick={() => {
                    props.history.push("/user/profile");
                  }}
                >
                  {_cur_user.hasUser ? (
                    <div className="flex items-center">
                      <Avatar
                        className="mr-5"
                        src={
                          _cur_user.userData.profile_picture
                            ? _cur_user.userData.profile_picture
                            : "https://cdn.discordapp.com/attachments/912411399458795593/921097628446498887/36..04.jpg"
                        }
                        alt=""
                        aria-hidden="true"
                      />
                      <h1>{_cur_user.userData.user_name}</h1>
                    </div>
                  ) : (
                    <></>
                  )}
                </DropdownItem>

                <DropdownItem
                  className="defTextCol dropDownItem"
                  tag={Link}
                  to="/account"
                >
                  <BsGearFill className="w-5 h-5 mr-5" aria-hidden="true" />
                  <span className=" font-normal">Settings</span>
                </DropdownItem>

                <DropdownItem
                  tag="a"
                  onClick={() => {
                    props.history.push("/user/myorders");
                  }}
                  className="defTextCol dropDownItem"
                >
                  <GoPackage
                    className="w-5 h-5 mr-5 defTextCol2"
                    aria-hidden="true"
                  />
                  <span className=" font-normal">Orders</span>
                </DropdownItem>

                <DropdownItem
                  tag="a"
                  onClick={() => {
                    dispatch(
                      openInputModal({
                        title: "Chat",
                        component: (
                          <Chat
                            userId={_cur_user.userData._id}
                            yourProfilePicture={
                              _cur_user.userData.profile_picture
                            }
                            profile_info={{
                              profile_picture:
                                _cur_user.userData.profile_picture,
                              user_name: _cur_user.userData.user_name,
                            }}
                          />
                        ),
                        onAccept: () => {},
                        acceptBtnText: "Send",
                        cancelBtnText: "Cancel",
                      })
                    );
                  }}
                  className="defTextCol dropDownItem"
                >
                  <IoChatbubblesSharp
                    className="w-5 h-5 mr-5 defTextCol2"
                    aria-hidden="true"
                  />
                  <span className=" font-normal">Chat Admin</span>
                </DropdownItem>

                <DropdownItem
                  tag="a"
                  onClick={() => {
                    dispatch(
                      openInputModal({
                        title: "Liked Products",
                        component: <Favorites _id={_cur_user.userData._id} />,
                        onAccept: () => {},
                        acceptBtnText: "Send",
                        cancelBtnText: "Cancel",
                      })
                    );
                  }}
                  className="defTextCol dropDownItem"
                >
                  <BsHeartFill
                    className="w-5 h-5 mr-5 defTextCol"
                    aria-hidden="true"
                  />
                  <span className=" font-normal">Liked Products</span>
                </DropdownItem>

                <DropdownItem
                  tag="a"
                  className="defTextCol dropDownItem"
                >
                  <MdHelpCenter
                    className="w-5 h-5 mr-5 defTextCol2"
                    aria-hidden="true"
                  />
                  <a
                    rel="noreferrer"
                    target={"_blank"}
                    href="https://senpai-coders.github.io/Astig-Ecommerce/#/./user/UserGuide"
                    className=" font-normal"
                  >
                    User Manual
                  </a>
                </DropdownItem>

                <DropdownItem
                  className="defTextCol dropDownItem"
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
                  <MdOutlineLogout
                    className="w-5 h-5 mr-5"
                    aria-hidden="true"
                  />
                  <span className=" font-normal">Signout</span>
                </DropdownItem>
              </Dropdown>
            </li>
          </ul>
        </div>
      </header>
    </>
  );
};

export default withRouter(Header);
