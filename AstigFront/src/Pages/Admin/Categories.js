import React, { useState, useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import {
    openInputModal,
    openAlertModal,
    openNotifier,
} from "../../Features/uiSlice";
import ProtectedLoader from "../../Components/ProtectedLoader";

import { RiCloseLine, RiFileExcel2Fill } from "react-icons/ri";

import {API, baseURL} from "../../Helpers/api";
import { getAuth, nShorter, getTickUpdate } from "../../Helpers/uitils";

import {
    Button,
    Input,
    Table,
    TableBody,
    TableRow,
    TableHeader,
    TableCell,
    TableContainer,
} from "@windmill/react-ui";

import HelperLabel from "../../Components/HelperLabel";
import CategoryCreator from "../../Components/ModalComponent/Admin/CategoryCreator";

const Categories = () => {
    const adminData = useSelector((state) => state.admin.adminData);
    const dispatch = useDispatch();

    const [loadingData, setLoadingData] = useState(true);
    //const [unmounted, setUnmounted] = useState(false)
    const [categories, setCategories] = useState([]);

    const [search, setSearch] = useState("");
    const [searching, setSearching] = useState(false);

    const performSearch = async () => {
        try {
            if (search.length === 0) {
                setCategories([])
                setLoadingData(true);
                loadSomething();
                setSearching(false);
                return;
            }
            setCategories([])
            setLoadingData(true);
            setSearching(true);
            const response = await API.post("/admin/searchCategory", {
                category_name: search,
                auth: getAuth()
            });
            setCategories(response.data.categories);
            setLoadingData(false);
        } catch (e) {
            catchHandler(e);
        }
    };

    const catchHandler = (e) => {
        if (e.response) {
            dispatch(
                openAlertModal({
                    component: <></>,
                    data: e.response.data,
                })
            );
        } else if (e.request) {
            dispatch(
                openAlertModal({
                    component: <></>,
                    data: {
                        err: 500,
                        description: "Sorry, but we can't reach the server",
                        solution: "Please try again later",
                    },
                })
            );
        } else {
            console.log("Error", e.message);
        }
    };

    const loadSomething = async () => {
        if (adminData) {
            try {
                const response = await API.post("/admin/categories", { auth: getAuth() });
                //if(unmounted) return
                setCategories(response.data.categories);
                setLoadingData(false);
                setSearching(false);
                setSearch('')
            } catch (e) { }
        }
    };

    const deleteCategory = async (_id, oldCategory, mode) => {
        try {
            const update = await API.post("/admin/updateCategories", {
                _id,
                category: {},
                oldCategory,
                mode,
                auth: getAuth()
            });
            setLoadingData(true)
            loadSomething();
        } catch (e) {
            catchHandler(e);
        }
    };

    useEffect(() => {
        loadSomething()
        // const interval = setInterval(() => {
        //     loadSomething();
        //   }, getTickUpdate());

        return () => {
            //setUnmounted(true);
            //clearInterval(interval)
        };
    }, [adminData]);

    return (
        <div className="h-screen w-full bg-gray-50 ">
            {!adminData ? (
                <ProtectedLoader />
            ) : (
                <div>
                    <h1 className="text-teal-900 mx-9 mt-14 font-medium text-3xl">
                        Categories
                    </h1>
                    <div className="mx-8 my-4">
                        <HelperLabel
                            bg={"bg-gray-100"}
                            txtbg={"text-teal-700"}
                            isError={false}
                            msg={
                                "This will help you easily categorize your categories as well as help user to filter result in Loft 16 website"
                            }
                        />
                    </div>
                    <div className="mx-4 flex relative my-8 space-x-4 items-center">
                        <Button
                            className="rounded-md "
                            disabled={loadingData}
                            onClick={() => {
                                dispatch(
                                    openInputModal({
                                        title: "",
                                        component: (
                                            <CategoryCreator
                                                mode={0}
                                                onSave={loadSomething}
                                                _id={adminData._id}
                                            />
                                        ),
                                        onAccept: () => { },
                                        acceptBtnText: "Save",
                                        cancelBtnText: "Cancel",
                                    })
                                );
                            }}
                        >
                            New Category
                        </Button>
                        <div className="flex items-center ">
                            <div className="relative w-full mr-3 text-green-900 h-full  focus-within:text-green-700 ">
                                <Input
                                    className=" rounded-lg border-0 bg-gray-100 transition duration-500 text-gray-400 hover:text-gray-700 focus:text-gray-700"
                                    placeholder="Search Category"
                                    aria-label="New Number"
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
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
                                className="px-4 w-2/6 rounded-md h-full"
                                onClick={() => {
                                    performSearch()
                                }}
                            >
                                Search
                            </Button>
                        </div>
                        <Button
                            className="rounded-md absolute right-0"
                            disabled={loadingData}
                            icon={RiFileExcel2Fill}
                            onClick={() => { window.open(`${baseURL}/static/export_categories`, '_blank').focus(); }}
                        >
                            Export Data
                        </Button>
                    </div>
                    {!loadingData && searching && (
                        <p className="my-8 text-center text-sm text-blue-700">
                            {categories.length} Search Result
                        </p>
                    )}

                    <section className="mx-4 body-font  pb-4">
                        <TableContainer>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableCell>Category Name</TableCell>
                                        <TableCell>Associated Products</TableCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {!loadingData &&
                                        categories.map((category, idx) => (
                                            <TableRow
                                                onClick={() => {
                                                    dispatch(
                                                        openInputModal({
                                                            title: "",
                                                            component: (
                                                                <CategoryCreator
                                                                    mode={1}
                                                                    onSave={loadSomething}
                                                                    _id={adminData._id}
                                                                    gcategory={category}
                                                                />
                                                            ),
                                                            onAccept: () => { },
                                                            acceptBtnText: "Save",
                                                            cancelBtnText: "Cancel",
                                                        })
                                                    );
                                                }}
                                                key={idx}
                                                className="cursor-pointer transition hover:bg-gray-100 duration-400"
                                            >
                                                <TableCell className="text-teal-900 ">
                                                    {category.category_name}
                                                </TableCell>
                                                <TableCell>
                                                    <p className="text-gray-500">
                                                        <span className=" font-medium">
                                                            {nShorter(category.associated_products.length, 1)}
                                                        </span>
                                                    </p>
                                                </TableCell>
                                                <TableCell>
                                                    <RiCloseLine
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            dispatch(
                                                                openNotifier({
                                                                    title: "Remove Category",
                                                                    message: (
                                                                        <>
                                                                            {`You are about to remove "${category.category_name}", are you sure to remove this category?`}
                                                                            <div className="mx-8 my-4">
                                                                                <HelperLabel
                                                                                    bg={"bg-gray-100"}
                                                                                    txtbg={"text-teal-700"}
                                                                                    isError={false}
                                                                                    msg={
                                                                                        "Product associated with this category will not be updated/remove."
                                                                                    }
                                                                                />
                                                                                <HelperLabel
                                                                                    bg={"bg-gray-100"}
                                                                                    txtbg={"text-teal-700"}
                                                                                    isError={false}
                                                                                    msg={
                                                                                        "User cannot search this category anymore"
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </>
                                                                    ),
                                                                    onAccept: () => {
                                                                        deleteCategory(adminData.id, category, -1);
                                                                    },
                                                                    acceptBtnText: "Yes, Remove it",
                                                                    cancelBtnText: "Cancel",
                                                                })
                                                            );
                                                        }}
                                                        className="cursor-pointer  text-gray-400 hover:text-red-600 hover:shadow-2xl rounded-full"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    {loadingData && (
                                        <TableRow className="transition filter blur-sm animate-pulse hover:bg-gray-100 duration-400">
                                            <TableCell className="text-teal-900 ">---</TableCell>
                                            <TableCell>
                                                <p className="text-gray-500">
                                                    <span className=" font-medium">---</span>
                                                </p>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <div>
                            {!loadingData && !searching && categories.length === 0 && (
                                <p className="my-4 text-xs text-red-400 text-center">
                                    There's no categories, please add before creating product
                                </p>
                            )}
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
};

export default Categories;
