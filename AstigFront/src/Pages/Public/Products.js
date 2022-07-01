import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

import { Input, Dropdown, Label, Button } from "@windmill/react-ui";

import { BiSearch } from "react-icons/bi";
import { BsFilter } from "react-icons/bs";
import { MdCategory } from "react-icons/md";

import FullPageLoader from "../../Components/ProtectedLoader";

import { useDispatch, useSelector } from "react-redux";
import { setUserSearch, setData, setFilter } from "../../Features/appSlice";

import API from "../../Helpers/api";

import { motion } from "framer-motion";

/* Icons */
import { GiWindpump } from "react-icons/gi";
import { numberWithCommas } from "../../Helpers/uitils";

const Products = (props) => {
  const dispatch = useDispatch();
  const appState = useSelector((state) => state.app.appState);
  const history = props.history;

  const [loading, setLoading] = useState(true);
  const [toShow, setToShow] = useState(false);
  const [scope, setScope] = useState("all");
  const [FilterOpen, setFilterOpen] = useState(false);
  const [vlby, setvlby] = useState(0);
  const [srtby, setsrtby] = useState(0);
  const [mobTogCat, setMobTogCat] = useState(false);

  const [categories, setCategories] = useState([]);

  const setFilterScope = (scope) => {
    dispatch(
      setFilter({
        filter: {
          //max: 50,
          scope,
          availability: "all",
          sortBy: "all",
        },
      })
    );
    setScope(scope);
    getProducts2(scope);
  };

  const getProducts2 = async (scope) => {
    setLoading(true);
    try {
      let filter = { ...appState.filter, scope: scope };
      const req = await API.post("/browse/getproduct", {
        userSearch: appState.userSearch,
        filter: filter,
      });
      let fdata = additionalFiltering(req.data.products);
      dispatch(setData({ data: fdata }));
      setLoading(false);
      setToShow(true);
    } catch (e) {
      console.log("ERR", e);
    }
  };

  const getProducts = async () => {
    setLoading(true);
    try {
      let filter = { ...appState.filter };
      filter.scope = scope;
      const req = await API.post("/browse/getproduct", { ...appState, filter });
      let fdata = additionalFiltering(req.data.products);
      dispatch(setData({ data: fdata }));
      setLoading(false);
      setToShow(true);
    } catch (e) {
      console.log("ERR", e);
    }
  };

  const onSearchEnter = (event) => {
    if (event.key === "Enter") getProducts();
  };

  const typing = (event) => {
    let txt = event.target.value;
    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    setToShow(false);
    if (format.test(txt)) return;

    dispatch(setUserSearch({ userSearch: txt }));
    if (event.target.value.length === 0) {
      dispatch(setUserSearch({ userSearchText: "" }));
    }
  };

  const amIFilter = (myscope) =>
    scope.toLowerCase() === myscope.toLowerCase()
      ? "transition duration-500 font-medium px-4 py-2 rounded-md mx-2"
      : "transition duration-500 px-4 py-2  rounded-sm mx-2 ";

  const amIFilter2 = (myscope) =>
    scope.toLowerCase() === myscope.toLowerCase()
      ? "block font-medium text-gray-900 dark:text-gray-300 underline"
      : "block font-medium text-gray-500 dark:text-gray-300 hover:underline";

  const getCategories = async () => {
    try {
      const response = await API.get("/browse/getCategories");
      setCategories(response.data.categories);
    } catch (err) {}
  };

  useEffect(()=>{window.scrollTo(0, 0);},[])

  useEffect(() => {
    getProducts();
    getCategories();
  }, []);

  // for sorting of product results
  const sortPrice = (a, b) => {
    const A = a.variants[0].price;
    const B = b.variants[0].price;
    if (srtby === -1) {
      if (A > B) return -1;
      if (A < B) return 1;
    }
    if (srtby === 1) {
      if (A < B) return -1;
      if (A > B) return 1;
    }
    return 0;
  };

  // for filter
  const additionalFiltering = (data) => {
    let filteredData = data;

    if (vlby !== 0) {
      if (vlby === 1)
        filteredData = data.filter((item) => item.total_stock > 0);
      if (vlby === -1)
        filteredData = data.filter((item) => item.total_stock <= 0);
    }

    filteredData.sort(sortPrice);

    return filteredData;
  };

  const setsrt = (mode) => {
    setsrtby(mode);
  };

  const setvl = (mode) => {
    setvlby(mode);
  };

  return (
    <motion.div
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.75 }}
    >
      <section className="bg-white dark:bg-gray-900">
        <div className="container px-6 py-8 mx-auto">
          <div className="lg:flex lg:-mx-2">
            <div className="hidden lg:block space-y-3 lg:w-1/5 lg:px-2 lg:space-y-4">
              <p className="text-2xl defTextCol mb-4 font-quicksand">
                Categories
              </p>
              <a
                href="#all"
                onClick={() => setFilterScope("all")}
                className={amIFilter2("all")}
              >
                All
              </a>
              {categories.map((cat, idx) => (
                <a
                  href={`#${cat.category_name}`}
                  key={idx}
                  onClick={() => setFilterScope(cat.category_name)}
                  className={amIFilter2(cat.category_name)}
                >
                  {cat.category_name}
                </a>
              ))}
            </div>
            <div className="mt-6 lg:mt-0 lg:px-2 lg:w-4/5 ">
              <div className="lg:hidden flex justify-center mt-2 mb-8">
                <div className="relative text-green-900 h-full md:w-6/12 mr-2  focus-within:text-green-700 ">
                  <div className="absolute inset-y-0 flex items-center pl-2">
                    <BiSearch className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <Input
                    className="pl-8 rounded-lg border-0 bg-gray-100 transition duration-500 text-gray-400 hover:text-gray-700 focus:text-gray-700"
                    placeholder=""
                    aria-label="Search"
                    value={appState.userSearch}
                    onChange={(e) => {
                      typing(e);
                    }}
                    onKeyDown={onSearchEnter}
                  />
                </div>
              </div>
              <div className="flex justify-center mt-2 mb-8">
                <div className=" lg:hidden relative">
                  <Dropdown
                    className="custom_shadow p-5 top-8 z-10"
                    isOpen={mobTogCat}
                    onClose={() => setMobTogCat(false)}
                  >
                    <div className="space-y-2 h-96 overflow-y-auto">
                      <p className="text-2xl defTextCol mb-4 font-quicksand">
                        Categories
                      </p>
                      <a
                        href="#all"
                        onClick={() => setFilterScope("all")}
                        className={amIFilter2("all")}
                      >
                        All
                      </a>
                      {categories.map((cat, idx) => (
                        <a
                          href={`#${cat.category_name}`}
                          key={idx}
                          onClick={() => setFilterScope(cat.category_name)}
                          className={amIFilter2(cat.category_name)}
                        >
                          {cat.category_name}
                        </a>
                      ))}
                    </div>
                  </Dropdown>
                  <Button
                    onClick={() => {
                      setMobTogCat(true);
                    }}
                    icon={MdCategory}
                    style={{ background: "rgb(240,240,240)" }}
                    className="text-gray-700 mr-2 rounded-sm"
                  >
                    Categories
                  </Button>
                </div>
                <div className="hidden lg:block relative text-green-900 h-full md:w-6/12 mr-2  focus-within:text-green-700 ">
                  <div className="absolute inset-y-0 flex items-center pl-2">
                    <BiSearch className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <Input
                    className="pl-8 rounded-lg border-0 bg-gray-100 transition duration-500 text-gray-400 hover:text-gray-700 focus:text-gray-700"
                    placeholder=""
                    aria-label="Search"
                    value={appState.userSearch}
                    onChange={(e) => {
                      typing(e);
                    }}
                    onKeyDown={onSearchEnter}
                  />
                </div>
                <div className=" relative">
                  <Dropdown
                    className="custom_shadow p-5 top-8 -left-28"
                    isOpen={FilterOpen}
                    onClose={() => setFilterOpen(false)}
                  >
                    <div>
                      <div className="flex justify-between items-center">
                        <p className="text-xl font-semibold text-black">
                          Filters
                        </p>
                        <Button
                          className="defTextCol px-3 py-2 rounded-md "
                          onClick={() => getProducts()}
                        >
                          Apply
                        </Button>
                      </div>
                      <div className="my-4 flex flex-col">
                        <p className="text-lg text-black">Availability</p>
                        <Label className="my-1" check>
                          <Input
                            type="checkbox"
                            onChange={() => setvl(0)}
                            checked={vlby === 0}
                          />
                          <span className="ml-2">All</span>
                        </Label>
                        <Label className="my-1" check>
                          <Input
                            type="checkbox"
                            onChange={() => setvl(1)}
                            checked={vlby === 1}
                          />
                          <span className="ml-2">In Stock</span>
                        </Label>
                        <Label className="my-1" check>
                          <Input
                            type="checkbox"
                            onChange={() => setvl(-1)}
                            checked={vlby === -1}
                          />
                          <span className="ml-2">Out Of Stock</span>
                        </Label>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-lg text-black">Sort By Price</p>
                        <Label className="my-1" check>
                          <Input
                            type="checkbox"
                            onClick={() => setsrt(0)}
                            checked={srtby === 0}
                          />
                          <span className="ml-2">All</span>
                        </Label>
                        <Label className="my-1" check>
                          <Input
                            type="checkbox"
                            onClick={() => setsrt(1)}
                            checked={srtby === 1}
                          />
                          <span className="ml-2">Low - High</span>
                        </Label>
                        <Label className="my-1" check>
                          <Input
                            type="checkbox"
                            onClick={() => setsrt(-1)}
                            checked={srtby === -1}
                          />
                          <span className="ml-2">High - Low</span>
                        </Label>
                      </div>
                    </div>
                  </Dropdown>
                  <Button
                    onClick={() => {
                      setFilterOpen(true);
                    }}
                    icon={BsFilter}
                    className={amIFilter("Filter") + "text-gray-700"}
                  >
                    Filters
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm tracking-widest uppercase ">
                <p className="text-gray-500 dark:text-gray-300">
                  {appState.data.length} Items
                </p>
                <div className="flex items-center"></div>
              </div>
              {toShow && !loading && appState.data.length === 0 ? (
                <div className="w-full defTextCol h-6/12 flex mt-5 flex-col items-center">
                  <p className=" font-medium">No Product Matched</p>
                  <GiWindpump className="mt-11 w-32 h-32 m-auto" />
                </div>
              ) : (
                <></>
              )}
              {loading ? (
                <FullPageLoader />
              ) : (
                <div className=" grid grid-cols-1 gap-8 mt-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {appState.data.map((prod, idx) => (
                    <motion.div
                      className="card-container"
                      initial={{ x: -1, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.008, duration: 0.75 }}
                      key={idx}
                      onClick={() => {
                        history.push(`/productdetail/${prod._id}`);
                      }}
                      className="flex cursor-pointer font-quicksand flex-col items-center justify-center w-full max-w-lg mx-auto"
                    >
                      <img
                        className="object-cover w-full rounded-md h-72 xl:h-80"
                        src={prod.Images[0]}
                        alt="T-Shirt"
                      />
                      <h4 className="mt-2 text-lg font-medium text-gray-700 dark:text-gray-200">
                        {prod.name}
                      </h4>
                      <p className="defTextCol text-lg">
                        Php {numberWithCommas(prod.variants[0].price)}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default withRouter(Products);
