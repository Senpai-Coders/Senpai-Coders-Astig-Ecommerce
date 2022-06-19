import React, { useState, useEffect } from "react";

import { useSelector } from "react-redux";
import ProtectedLoader from "../../Components/ProtectedLoader";
import {API, baseURL} from "../../Helpers/api";


import { getTickUpdate, numberWithCommas, getAuth } from "../../Helpers/uitils";

import { BsHeartFill, BsCollectionFill } from "react-icons/bs";
import { MdOutlineCategory } from "react-icons/md";
import { RiCloseLine, RiFileExcel2Fill } from "react-icons/ri";

import { useDispatch } from "react-redux";
import {
  openInputModal,
  openNotifier,
  openAlertModal,
} from "../../Features/uiSlice";
import ProductView from "../../Components/ModalComponent/Admin/ProductView";
import Informative from "../../Components/Modal/Informative";
import HelperLabel from "../../Components/HelperLabel";

import {
  Table,
  TableContainer,
  TableBody,
  TableHeader,
  TableRow,
  TableCell,
  Avatar,
  Input,
  Button,
  Label,
  Select,
} from "@windmill/react-ui";

const Products = () => {
  const dispatch = useDispatch();
  const adminData = useSelector((state) => state.admin.adminData);
  const [loadingData, setLoadingData] = useState(true);
  //const [unmounted, setUnmounted] = useState(false);

  const [products, setProducts] = useState([]);
  const [productsCopy, setProductsCopy] = useState([]);

  const [category, setCategory] = useState("All");
  const [stock, setStock] = useState("All");

  const [cat, setCat] = useState([]);

  const [searchName, setSearchName] = useState("");
  const [searchId, setSearchId] = useState("");

  const loadSomething = async () => {
    if (adminData) {
      try {
        const response = await API.post("/admin/products", { auth: getAuth() });
        setCat(response.data.cat);
        setProductsCopy(response.data.products);
        setProducts(response.data.products);
        setLoadingData(false);
        return response;
      } catch (e) {}
    }
  };

  const getFiltered = (cate, stock, name, id) => {
    let data = productsCopy;

    if (stock !== "All") {
      if (stock === "In Stock")
        data = productsCopy.filter((item) => item.total_stock > 0);
      else data = productsCopy.filter((item) => item.total_stock <= 0);
    }

    if (cate !== "All") {
      let newData = [];

      data.forEach((product, idx) => {
        if (product.categories.includes(cate)) newData.push(product);
      });

      data = newData;
    }

    if (name !== "") {
      data = data.filter((item) => item.name.includes(name));
    }

    if (id !== "") {
      data = data.filter((item) => item._id.includes(id));
    }

    return data;
  };

  const deleteProd = async (product) => {
    try {
      const res = await API.post("/admin/updateProduct", {
        mode: -1,
        prod_Id: product._id,
        auth: getAuth(),
      });
      loadSomething();
      setLoadingData(false);
    } catch (error) {
      if (error.response) {
        dispatch(
          openAlertModal({
            component: <Informative />,
            data: {
              description: error.response.data.description,
              solution: error.response.data.solution,
            },
          })
        );
        return;
      }
      dispatch(
        openAlertModal({
          component: <Informative />,
          data: {
            description: "We can't reach the server",
            solution: "Please try again later",
          },
        })
      );
    }
  };

  const parseCategories = (categories) => {
    let cats = ''
    for(var x = 0; x < categories.length; x++){
        let tempCats = cats + `${categories[x]}${x!==categories.length-1 ? ', ' : ''}`
        if(tempCats.length >= 100){
            cats = cats.slice(0,-2) +'...';
            break
        }
        cats = tempCats
    }
    return cats;
  }

  useEffect(() => {
    setLoadingData(true);
    loadSomething();
    // const interval = setInterval(() => {
    //   loadSomething();
    // }, getTickUpdate());

    return () => {
      //setUnmounted(true);
      //clearInterval(interval);
    };
  }, [adminData]);

  return (
    <div className="h-screen w-full bg-gray-50 ">
      {!adminData ? (
        <ProtectedLoader />
      ) : (
        <div>
          <h1 className="text-teal-900 mx-9 mt-14 font-medium text-3xl">
            Products
          </h1>

          <div className="relative flex mx-9 my-8 space-x-4 items-center">
            <div className=" flex">
              <Label className="flex items-center w-full mr-3">
                <MdOutlineCategory className="text-teal-600 w-6 h-6" />
                <Select
                  className="ml-2"
                  onChange={async (e) => {
                    if (e.target.value === "All" && stock === "All") {
                      setCategory("All");
                      loadSomething();
                      return;
                    }
                    setCategory(e.target.value);
                    setProducts(
                      getFiltered(e.target.value, stock, searchName, "")
                    );
                  }}
                >
                  <option>All</option>
                  {cat.map((cate, idx) => (
                    <option key={idx}>{cate.category_name}</option>
                  ))}
                </Select>
              </Label>
              <Label className="flex items-center w-full mr-3">
                <BsCollectionFill className="text-teal-600 w-6 h-6" />
                <Select
                  className="ml-2"
                  onChange={async (e) => {
                    if (e.target.value === "All" && category === "All") {
                      setStock("All");
                      loadSomething();
                      return;
                    }
                    setStock(e.target.value);
                    setProducts(
                      getFiltered(category, e.target.value, searchName, "")
                    );
                  }}
                >
                  <option>All</option>
                  <option>In Stock</option>
                  <option>Out Of Stock</option>
                </Select>
              </Label>
              <div className="relative w-full mr-3 text-green-900 h-full  focus-within:text-green-700 ">
                <Input
                  className=" rounded-lg border-1 bg-gray transition duration-500 text-gray-400 hover:text-gray-700 focus:text-gray-700"
                  placeholder="Search By Name"
                  aria-label="New Number"
                  value={searchName}
                  onChange={(e) => {
                    setSearchName(e.target.value);
                    setProducts(
                      getFiltered(category, stock, e.target.value, "")
                    );
                  }}
                />
              </div>
              <div className="relative w-full mr-2 text-green-900 h-full  focus-within:text-green-700 ">
                <Input
                  className=" rounded-lg border-1 bg-white transition duration-500 text-gray-400 hover:text-gray-700 focus:text-gray-700"
                  placeholder="Search By ID"
                  aria-label="New Number"
                  value={searchId}
                  onChange={(e) => {
                    setSearchId(e.target.value);
                    setProducts(
                      getFiltered(category, stock, searchName, e.target.value)
                    );
                  }}
                />
              </div>
            </div>
            <Button
              className="rounded-md "
              disabled={loadingData || cat.length === 0}
              onClick={() => {
                dispatch(
                  openInputModal({
                    title: "Prod",
                    component: (
                      <ProductView
                        _id={adminData._id}
                        mode={0}
                        onSave={loadSomething}
                      />
                    ),
                    onAccept: () => {},
                    acceptBtnText: "Place Order",
                    cancelBtnText: "Cancel",
                  })
                );
              }}
            >
              New Product
            </Button>
            <Button
            className="rounded-md absolute right-0"
            disabled={loadingData}
            icon={ RiFileExcel2Fill }
            onClick={() => {
                window.open(`${baseURL}/static/export_products`, '_blank').focus();
            }}
          >
            Export Data
          </Button>
          </div>
          {cat.length === 0 && (
            <div className="mt-8 mx-4">
              <HelperLabel
                isError={true}
                msg={
                  "There is no category, please create one before adding products"
                }
              />
            </div>
          )}
          <section className="mx-4 pb-4 mt-8 body-font">
            <TableContainer>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell> </TableCell>
                    <TableCell>Porduct Name</TableCell>
                    <TableCell>Total Stock</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Variants</TableCell>
                    <TableCell>Sold</TableCell>
                    <TableCell>Generated Sale</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!loadingData &&
                    products.map((product, idx) => (
                      <TableRow
                        onClick={() => {
                          dispatch(
                            openInputModal({
                              title: "Prod",
                              component: (
                                <ProductView
                                  _id={adminData._id}
                                  data={product}
                                  mode={1}
                                  onSave={loadSomething}
                                />
                              ),
                              onAccept: () => {},
                              acceptBtnText: "Place Order",
                              cancelBtnText: "Cancel",
                            })
                          );
                        }}
                        key={idx}
                        className="transition cursor-pointer hover:bg-gray-100 duration-400"
                      >
                        <TableCell>
                          <Avatar
                            className="border-2 border-teal-600"
                            src={product.Images[0]}
                          />
                        </TableCell>

                        <TableCell className="text-teal-900   ">
                          <div className=" overflow-hidden">
                            <p>{product.name}</p>
                            <p className="text-xs mt-1 break-all text-gray-400 italic">
                              {
                                  parseCategories(product.categories)
                              }
                            </p>

                            <p
                              className="mt-1 italic"
                              style={{ fontSize: "10px" }}
                            >
                              ID: {product._id}
                            </p>
                          </div>
                        </TableCell>

                        <TableCell>
                          <p className="text-gray-500">
                            <span className=" font-medium">
                              {product.total_stock}
                            </span>
                          </p>
                        </TableCell>
                        <TableCell>
                          <p
                            className={`font-medium text-teal-600 ${
                              product.variants.length === 0 &&
                              "font-xs text-red-400"
                            }`}
                          >
                            {product.variants.length === 0
                              ? "No Price Specified"
                              : numberWithCommas(product.variants[0].price)}
                          </p>
                        </TableCell>

                        <TableCell>
                          {/* <div className="flex text-orange-500 font-medium items-center h-full">
                            <BsHeartFill className="text-red-400 mr-4" />
                            {nShorter(product.likes, 2)}{" "}
                          </div> */}
                          {product.variants.length}
                        </TableCell>

                        <TableCell>
                          {/* <div className="flex text-orange-500 font-medium items-center h-full">
                            <BsHeartFill className="text-red-400 mr-4" />
                            {nShorter(product.likes, 2)}{" "}
                          </div> */}
                          {product.total_item_sold}
                        </TableCell>

                        <TableCell>
                          <p>
                            <span className="font-quicksand">Php</span>{" "}
                            {numberWithCommas(product.generated_sale)}
                          </p>
                        </TableCell>

                        <TableCell>
                          <div
                            className="text-red-400 flex items-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(
                                openNotifier({
                                  title: "Delete Product",
                                  message: `You are about to remove this product forever, are you sure to remove this product?`,
                                  onAccept: () => {
                                    deleteProd(product);
                                  },
                                  acceptBtnText: "Yes, Remove It",
                                  cancelBtnText: "Cancel",
                                })
                              );
                            }}
                          >
                            <RiCloseLine />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}

                  {loadingData && (
                    <TableRow className="filter blur-sm">
                      <TableCell>
                        <Avatar className="border-2 border-teal-600" />
                      </TableCell>
                      <TableCell className="text-teal-900 ">000k</TableCell>
                      <TableCell>
                        <p className="text-gray-500">
                          <span className=" font-medium">000k</span>
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-teal-500">000k</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex text-orange-500 font-medium justify-between w-4/12 items-center h-full">
                          000k <BsHeartFill className="text-red-400 ml-4" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex text-orange-500 font-medium justify-between w-4/12 items-center h-full">
                          000k <BsHeartFill className="text-red-400 ml-4" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex text-orange-500 font-medium justify-between w-4/12 items-center h-full">
                          000k <BsHeartFill className="text-red-400 ml-4" />
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {!loadingData && products.length === 0 && (
              <p className="my-4 text-xs text-red-400 text-center">
                There's no products
              </p>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default Products;
