import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { openInputModal, closeInputModal } from "../../Features/uiSlice";

import ProtectedLoader from "../../Components/ProtectedLoader";
import { API, baseURL } from "../../Helpers/api";
import { numberWithCommas, parseDate, getTickUpdate, getAuth } from "../../Helpers/uitils";

import { Avatar, Button, Dropdown, Input, DropdownItem } from "@windmill/react-ui";
import HelperLabel from "../../Components/HelperLabel";
import CancelOrderForm from "../../Components/ModalComponent/Admin/CancelOrderForm";
import ViewOrderDetails from "../../Components/ModalComponent/Admin/ViewOrderDetails";

import { RiTruckFill, RiFileExcel2Fill } from "react-icons/ri";
import { BsThreeDotsVertical, BsFillCheckCircleFill } from "react-icons/bs";
import { TiCancel } from "react-icons/ti"

const PendingOrders = () => {
    const adminData = useSelector((state) => state.admin.adminData);
    const [loadingData, setLoadingData] = useState(true);
    const [unmounted, setUnmounted] = useState(false);
    const [pendings, setPendings] = useState([]);

    const [chosenIdx, setChosenIdx] = useState(-1);
    const [specificUpdate, setSpecificUpdate] = useState(-1);

    const [search, setSearch] = useState("");
    const [searching, setSearching] = useState(false);

    const [exporting, setExporting] = useState(false)

    const dispatch = useDispatch();

    const loadSomething = async () => {
        if (adminData) {
            try {
                const response = await API.post("/admin/pendings", { auth: getAuth() });
                if (unmounted) return;
                setPendings(response.data.pendings);
                setLoadingData(false);
                setSpecificUpdate(-1);
            } catch (e) { }
        }
    };


    const performSearch = async () => {
        try {
            if (search.length === 0 && !search.length === 24) {
                setPendings([])
                setLoadingData(true);
                loadSomething();
                setSearching(false);
                return;
            }
            setPendings([])
            setLoadingData(true);
            setSearching(true);

            const response = await API.post("/admin/searchPendingOrders", {
                order_ID: search,
                auth: getAuth()
            });

            setPendings(response.data.pendings);
            setLoadingData(false);
        } catch (e) {

        }
    };

    const updatePendingOrder = async (entry, mode, reason, idx) => {
        try {
            setSpecificUpdate(idx);
            setChosenIdx(-1);
            dispatch(closeInputModal());
            const response = await API.post("/admin/updatePending", {
                _id: adminData._id,
                mode,
                entry,
                reason,
                auth: getAuth()
            });
            if (unmounted) return;
            loadSomething();
        } catch (e) { }
    };

    useEffect(() => {
        loadSomething();
        return () => {
            setUnmounted(true);
        };
    }, [adminData]);

    return (
        <div onClick={()=> loadSomething()} className="h-screen w-full bg-gray-50 ">
            {!adminData ? (
                <ProtectedLoader />
            ) : (
                <div>
                    <h1 className="text-teal-900 mx-9 mt-14 font-medium text-3xl">
                        Pending Orders
                    </h1>
                    <div className="mx-8 my-4">
                        <HelperLabel
                            bg={"bg-gray-100"}
                            txtbg={"text-teal-700"}
                            isError={false}
                            msg={
                                "When user placed an order, it needed your final review & approval of the products being requested"
                            }
                        />
                        <HelperLabel
                            bg={"bg-gray-100"}
                            txtbg={"text-teal-700"}
                            isError={false}
                            msg={
                                "You can Accept, or Cancel an order. If you cancel an order, you must provide a reason for the cancellation & it will automatically notify the user"
                            }
                        />
                        <HelperLabel
                            bg={"bg-gray-100"}
                            txtbg={"text-teal-700"}
                            isError={false}
                            msg={ "If user paid via GCash, you must verify the reference number before accepting the order" }
                        />
                    </div>
                    <div className="w-full mx-4 mt-8 md:mx-9">
                        <div className=" flex items-center relative">
                            <div className="relative md:1/2 mr-3 text-green-900 h-full  focus-within:text-green-700 ">
                                <Input
                                    className="rounded-lg border-0 bg-gray-100 transition duration-500 text-gray-500 hover:text-gray-700 focus:text-gray-700"
                                    placeholder="Order ID"
                                    aria-label="search"
                                    onChange={(e) => {
                                        setSearch(e.target.value)
                                    }}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            // TODO: Search
                                            performSearch()
                                        }
                                    }}
                                />
                            </div>
                            <Button
                                disabled={loadingData}
                                className="px-4 rounded-md h-full"
                                onClick={() => {
                                    if (search === "") {
                                        loadSomething()
                                        return
                                    }
                                    performSearch()
                                }}
                            >
                                Search
                            </Button>
                            <div className="absolute right-16">
                                <Button
                                    className="rounded-md"
                                    disabled={loadingData}
                                    icon={RiFileExcel2Fill}
                                    onClick={() => {
                                        setExporting(true)
                                    }}
                                >
                                    Export Data
                                </Button>
                                <Dropdown isOpen={exporting} onClose={() => { setExporting(false) }}>
                                    <DropdownItem tag="a" href="#" className="justify-between">
                                        <DropdownItem onClick={() => {
                                            window.open(`${baseURL}/static/export_pending_orders`, '_blank').focus();
                                        }} className="justify-between">
                                            <RiFileExcel2Fill className="text-teal-400 w-5 h-5 mr-4" />
                                            <span>Pending</span>
                                        </DropdownItem>
                                    </DropdownItem>
                                    <DropdownItem >
                                        <DropdownItem onClick={() => {
                                                window.open(`${baseURL}/static/export_cancelled_orders`, '_blank').focus();
                                        }} className="justify-between">
                                            <RiFileExcel2Fill className="text-red-400 w-5 h-5 mr-4" />
                                            <span>Cancelled</span>
                                        </DropdownItem>
                                    </DropdownItem>
                                </Dropdown>
                            </div>
                        </div>
                        {
                            (search.length !== 0 && search.length !== 24) && <HelperLabel msg="Order ID Must Contain 24 Characters" isError={false} bg={'bg-red-50'} txtbg={'text-red-400'} />
                        }
                    </div>
                    <hr className="my-6 mx-8 border-gray-200 dark:border-gray-700" />
                    <section className="body-font">
                        <div className=" pb-24 pt-2 md:pt-0 md:pr-0 md:pl-0">
                            {loadingData && <ProtectedLoader />}
                            {!loadingData && (
                                <div
                                    className={`my-8 px-4 flex w-full flex-col flex-wrap sm:flex-row `}
                                >
                                    {pendings.map((order, idx) => (
                                        <div
                                            key={idx}
                                            className={`w-full md:w-1/2 xl:w-1/3 ${specificUpdate === idx && "filter blur-sm animate-pulse"
                                                }`}
                                        >
                                            <div className="mb-4 mx-1">
                                                <div className="shadow-lg rounded-2xl p-4 bg-white dark:bg-gray-700 w-full">
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
                                                                onClick={() => setChosenIdx(idx)}
                                                                className="relative flex  p-1 h-7 w-7 hover:text-teal-800 text-teal-500 "
                                                            >
                                                                <BsThreeDotsVertical className="h-full w-full " />
                                                            </button>
                                                            <Dropdown
                                                                className="filter shadow-xl border p-5"
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
                                                                <button
                                                                    onClick={() =>
                                                                        updatePendingOrder(order, 0, "", idx)
                                                                    }
                                                                    className="flex items-center w-full px-4 py-1 text-sm rounded-md text-white bg-teal-500 border border-transparent active:bg-teal-700 hover:bg-teal-600 focus:ring focus:ring-teal-300"
                                                                >
                                                                    <BsFillCheckCircleFill
                                                                        className="w-5 h-5 mr-5"
                                                                        aria-hidden="true"
                                                                    />
                                                                    <span className="font-normal py-2">
                                                                        Accept
                                                                    </span>
                                                                </button>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        dispatch(
                                                                            openInputModal({
                                                                                title: "Checkout Details",
                                                                                component: (
                                                                                    <CancelOrderForm
                                                                                        entry={order}
                                                                                        record_index={idx}
                                                                                        onRemove={updatePendingOrder}
                                                                                    />
                                                                                ),
                                                                                onAccept: () => { },
                                                                                acceptBtnText: "Place Order",
                                                                                cancelBtnText: "Cancel",
                                                                            })
                                                                        );
                                                                    }}
                                                                    className="mt-2 flex items-center w-full px-4 py-1 text-sm rounded-md text-white bg-red-400 border border-transparent active:bg-red-500 hover:bg-red-500 focus:ring focus:ring-red-300"
                                                                >
                                                                    <TiCancel
                                                                        className="w-5 h-5 mr-5"
                                                                        aria-hidden="true"
                                                                    />
                                                                    <span className="font-normal py-2">
                                                                        Decline
                                                                    </span>
                                                                </button>
                                                            </Dropdown>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between mb-4 space-x-12">
                                                        <span
                                                            className={`px-2 filter shadow-md py-1 flex items-center font-semibold text-xs rounded-md ${order.order_detailed_version.order_status === 0
                                                                ? "bg-yellow-400 text-gray-50"
                                                                : "bg-teal-600 text-white"
                                                                }`}
                                                        >
                                                            Status :
                                                            {order.order_detailed_version.order_status === 0
                                                                ? " Waiting Approval"
                                                                : " Shipped"}
                                                        </span>

                                                        <span className="uppercase px-2 py-1 flex w-36 items-center text-xs rounded-md font-semibold text-yellow-400 bg-teal-100">
                                                            Placed :{" "}
                                                            {parseDate(order.order_detailed_version.cat)}
                                                        </span>
                                                    </div>
                                                    <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                                                        <div
                                                            className={`w-full h-full text-center text-xs text-white bg-yellow-400 rounded-full `}
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
                                                    {
                                                        order.mode_of_payment === "GCash" ? 
                                                        <span className="text-white bg-gradient-to-br from-purple-800 to-blue-800 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-3">Payed Via GCash</span>
                                                        : <span className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-3">Cash On Delivery</span>
                                                    }
                                                    <p className="my-4 text-xs text-gray-600">
                                                        Order ID :{" "}
                                                        <span className="font-medium text-teal-800">
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
                                {!loadingData && pendings.length === 0 && (
                                    <p className="my-4 text-xs text-red-400 text-center">
                                        {!searching ? "There's no pending orders" : "No matching order found"}
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

export default PendingOrders;
