import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { openInputModal, openAlertModal } from "../../Features/uiSlice";

import ProtectedLoader from "../../Components/ProtectedLoader";
import ViewOrderDetails from "../../Components/ModalComponent/Admin/ViewOrderDetails";
import Informative from "../../Components/Modal/Informative";

import {API, baseURL} from "../../Helpers/api";

import HelperLabel from "../../Components/HelperLabel";

import {
    Avatar,
    Button,
    Dropdown,
    DropdownItem,
    Input,
} from "@windmill/react-ui";

import { RiTruckFill, RiFileExcel2Fill } from "react-icons/ri";
import { BsThreeDotsVertical } from "react-icons/bs";
import { GiHandTruck, GiAirplaneArrival } from "react-icons/gi";
import { FaShippingFast } from "react-icons/fa";

import { getAuth, numberWithCommas, parseDate, getTickUpdate } from "../../Helpers/uitils";

const OrderInProgress = () => {
    const adminData = useSelector((state) => state.admin.adminData);
    const dispatch = useDispatch();

    const [loadingData, setLoadingData] = useState(true);
    const [unmounted, setUnmounted] = useState(false);

    const [inProgress, setInProgress] = useState([]);

    const [chosenIdx, setChosenIdx] = useState(-1);
    const [specificUpdate, setSpecificUpdate] = useState(-1);

    const [search, setSearch] = useState("");
    const [searching, setSearching] = useState(false);

    const loadSomething = async () => {
        if (adminData) {
            try {
                const response = await API.post("/admin/inProgress", { auth: getAuth() });
                if (unmounted) return;
                setInProgress(response.data.inProgress);
                setLoadingData(false);
                setSpecificUpdate(-1);
                console.log("LOADING SOMETHINg");
            } catch (e) { }
        }
    };

    const performSearch = async () => {
        try {
            if (search.length === 0) {
                setLoadingData(true);
                setSearching(false);
                loadSomething();
                return;
            }

            setInProgress([]);
            setLoadingData(true);
            setSearching(true);

            const response = await API.post("/admin/searchInProgress", {
                order_ID: search,
                auth: getAuth()
            });

            setInProgress(response.data.inprogress);
            setLoadingData(false);
        } catch (e) { }
    };

    const updateInProgress = async (entry, mode, status, idx) => {
        try {
            if (entry.order_detailed_version.order_status === status) {
                setChosenIdx(-1);
                return;
            }

            setSpecificUpdate(idx);
            setChosenIdx(-1);

            let entry_sm = { ...entry };

            delete entry_sm.user_profile;
            delete entry_sm.order_detailed_version;

            const response = await API.post("/admin/updateInProgress", {
                _id: adminData._id,
                mode,
                status,
                entry,
                entry_sm,
                auth: getAuth()
            });
            if (!searching) loadSomething();
            else {
                performSearch();
                setSpecificUpdate(-1);
            }
        } catch (e) {
            loadSomething();
            console.log(e);
            dispatch(
                openAlertModal({
                    component: <Informative />,
                    data: {
                        description: "Failed",
                        solution: e.response.data.solution,
                    },
                })
            );
        }
    };

    useEffect(() => {
        loadSomething()
        const interval = setInterval(() => {
            loadSomething();
        }, getTickUpdate());

        return () => {
            setUnmounted(true);
            clearInterval(interval)
        };
    }, [adminData]);

    return (
        <div className="h-screen w-full bg-gray-50 ">
            {!adminData ? (
                <ProtectedLoader />
            ) : (
                <div>
                    <h1 className="text-teal-900 mx-9 mt-14 font-medium text-3xl">
                        Orders In Progress
                    </h1>
                    <div className="w-full mx-4 mt-8">
                        <div className=" flex relative items-center my-8 ">
                            <div className="relative mr-5 text-green-900 h-full  focus-within:text-green-700 ">
                                <Input
                                    className="rounded-lg border-0 ml-3 bg-gray-100 transition duration-500 text-gray-500 hover:text-gray-700 focus:text-gray-700"
                                    placeholder="Order ID"
                                    aria-label="search"
                                    disabled={loadingData}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                    }}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            // TODO: Search
                                            performSearch();
                                        }
                                    }}
                                />
                            </div>
                            <Button
                                disabled={loadingData}
                                className="px-4 rounded-md h-full"
                                onClick={() => {
                                    performSearch();
                                }}
                            >
                                Search
                            </Button>
                            <Button
                                className="rounded-md absolute right-9"
                                disabled={loadingData}
                                icon={RiFileExcel2Fill}
                                onClick={() => {
                                    window.open(`${baseURL}/static/export_orders_in_progress`, '_blank').focus();
                                }}
                            >
                                Export Data
                            </Button>
                        </div>
                        
                        {
                            (search.length !== 0 && search.length !== 24) && <HelperLabel msg="Order ID Must Contain 24 Characters" isError={false} bg={'bg-red-50'} txtbg={'text-red-400'} />
                        }
                    </div>
                    <hr className="my-10 mx-8 border-gray-200 dark:border-gray-700" />
                    <section className="body-font">
                        <div className=" pb-24 pt-2 md:pt-0 md:pr-0 md:pl-0">
                            {loadingData && <ProtectedLoader />}
                            {!loadingData && (
                                <div
                                    className={`my-8 px-4 flex w-full flex-col flex-wrap sm:flex-row`}
                                >
                                    {inProgress.map((order, idx) => (
                                        <div
                                            key={idx}
                                            className={`w-full md:w-1/2 xl:w-1/3 ${specificUpdate === idx && "filter blur-sm animate-pulse"
                                                } `}
                                        >
                                            <div className="mb-4 mx-1">
                                                <div
                                                    className={`shadow-lg rounded-2xl p-4 bg-white dark:bg-gray-700 w-full ${order.order_detailed_version.order_status === 1 &&
                                                        "border border-orange-400"
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between mb-6">
                                                        <div className="flex items-center">
                                                            <Avatar
                                                                className="rounded-xl relative bg-blue-100"
                                                                size="large"
                                                                src={order.user_profile.profile_picture}
                                                            />
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-md text-black dark:text-white ml-2">
                                                                    <span className="font-normal">From </span>
                                                                    {order.user_profile.user_name}
                                                                </span>
                                                                <span className="text-sm text-gray-500 dark:text-white ml-2">
                                                                    {order.user_email}
                                                                </span>
                                                                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white ml-2">
                                                                    <span className="font-medium">via</span>
                                                                    <RiTruckFill className="text-teal-900 mx-2" />
                                                                    <span className="font-medium">
                                                                        {" "}
                                                                        {order.courier.courier_name}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="relative flex space-x-2">
                                                            <button
                                                                disabled={specificUpdate === idx}
                                                                onClick={() => {
                                                                    setChosenIdx(idx);
                                                                }}
                                                                className="relative flex  p-1 h-7 w-7 hover:text-teal-800 text-teal-500 "
                                                            >
                                                                <BsThreeDotsVertical className="h-full w-full " />
                                                            </button>
                                                            <Dropdown
                                                                className="absolute filter shadow-xl border p-5"
                                                                align="right"
                                                                isOpen={chosenIdx === idx}
                                                                onClose={() => {
                                                                    setChosenIdx(-1);
                                                                }}
                                                            >
                                                                <div>
                                                                    <p className="text-left font-medium text-lg mb-3">
                                                                        Update Status
                                                                    </p>
                                                                </div>
                                                                <DropdownItem
                                                                    onClick={() =>
                                                                        updateInProgress(order, 1, 1, idx)
                                                                    }
                                                                    className="dark:text-gray-200 text-gray-500 hover:text-purple-600"
                                                                >
                                                                    <GiHandTruck
                                                                        className="w-5 h-5 mr-5"
                                                                        aria-hidden="true"
                                                                    />
                                                                    <span className=" font-normal">
                                                                        set as Processing
                                                                    </span>
                                                                </DropdownItem>
                                                                <DropdownItem
                                                                    onClick={() =>
                                                                        updateInProgress(order, 1, 2, idx)
                                                                    }
                                                                    className="dark:text-gray-200 text-gray-500 hover:text-green-500"
                                                                >
                                                                    <FaShippingFast
                                                                        className="w-5 h-5 mr-5"
                                                                        aria-hidden="true"
                                                                    />
                                                                    <span className=" font-normal">
                                                                        set as Shipped
                                                                    </span>
                                                                </DropdownItem>
                                                                <DropdownItem
                                                                    onClick={() =>
                                                                        updateInProgress(order, 0, 3, idx)
                                                                    }
                                                                    className="p-5 bg-teal-500 text-white "
                                                                >
                                                                    <GiAirplaneArrival
                                                                        className="w-5 h-5 mr-5"
                                                                        aria-hidden="true"
                                                                    />
                                                                    <span className="font-normal py-2">
                                                                        Mark as Delivered
                                                                    </span>
                                                                </DropdownItem>
                                                            </Dropdown>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between mb-4 space-x-12">
                                                        <span
                                                            className={`px-2 filter shadow-md py-1 flex items-center font-semibold text-xs rounded-md ${order.order_detailed_version.order_status === 1
                                                                    ? "bg-orange-400 text-gray-50"
                                                                    : "bg-teal-600 text-white"
                                                                }`}
                                                        >
                                                            Status :
                                                            {order.order_detailed_version.order_status === 1
                                                                ? " Processing"
                                                                : " Shipped"}
                                                        </span>

                                                        <span className="uppercase px-2 py-1 flex items-center text-xs rounded-md font-semibold text-yellow-400 bg-teal-100">
                                                            Placed :{" "}
                                                            {parseDate(order.order_detailed_version.cat)}
                                                        </span>
                                                    </div>
                                                    <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                                                        <div
                                                            className={`w-full h-full text-center text-xs text-white ${order.order_detailed_version.order_status === 1
                                                                    ? "bg-orange-400 text-gray-50"
                                                                    : "bg-teal-600 text-white"
                                                                } rounded-full`}
                                                        ></div>
                                                    </div>
                                                    <div className="flex items-center justify-between my-4 space-x-4">
                                                        <span className="px-2 py-1 flex items-center text-md rounded-md text-teal-500 bg-green-50">
                                                            <span className="mr-2 text-teal-600 dark:text-white font-bold">
                                                                {order.n_items}
                                                            </span>
                                                            Items
                                                        </span>
                                                        <span className="px-2 py-1 flex items-center text-md rounded-md text-blue-500 bg-blue-100">
                                                            <p className=" text-teal-700">
                                                                ₱{" "}
                                                                <span className="">
                                                                    {numberWithCommas(order.total_cost)}
                                                                </span>
                                                            </p>
                                                        </span>
                                                    </div>
                                                    <p className="my-2 text-xs text-gray-600">
                                                        Order ID :{" "}
                                                        <span className="font-medium text-gray-900">
                                                            {order.order_ID}
                                                        </span>
                                                    </p>

                                                    <Button
                                                        onClick={() => {
                                                            dispatch(
                                                                openInputModal({
                                                                    title: "Checkout Details",
                                                                    component: <ViewOrderDetails order={order} />,
                                                                    onAccept: () => { },
                                                                    acceptBtnText: "Place Order",
                                                                    cancelBtnText: "Cancel",
                                                                })
                                                            );
                                                        }}
                                                        className="bg-teal-400 text-white w-full rounded-md"
                                                    >
                                                        View Details
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div>
                                {!loadingData && inProgress.length === 0 && (
                                    <p className="my-4 text-xs text-red-400 text-center">
                                        {!searching
                                            ? "There's no pending orders"
                                            : "No matching order found"}
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
};

export default OrderInProgress;
