import React, { useState, useEffect } from "react";

import {
  Button,
  Input,
  Label,
  Textarea,
  Dropdown,
  DropdownItem,
  Badge,
  Table,
  TableContainer,
  TableBody,
  TableHeader,
  TableRow,
  TableCell,
} from "@windmill/react-ui";

import HelperLabel from "../../HelperLabel";
import API from "../../../Helpers/api";
import { getAuth, nShorter, numberWithCommas } from "../../../Helpers/uitils";

import { MdOutlineClose, MdHideImage } from "react-icons/md";
import { BsHeartFill } from "react-icons/bs";
import { FaCoins, FaTruckLoading } from "react-icons/fa";
import { RiCloseLine, RiExchangeDollarLine } from "react-icons/ri";
import { AiFillStar, AiTwotoneFire } from "react-icons/ai";
import { GiDna1 } from "react-icons/gi";

import Loader from "../../admin/Loader";

import { useDispatch } from "react-redux";
import { closeInputModal, openAlertModal } from "../../../Features/uiSlice";
import Informative from "../../Modal/Informative";

import { storage } from "../../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';

const ProductView = ({ _id, data, mode, onSave }) => {
  const dispatch = useDispatch();

  const [productData, setProductData] = useState(data);
  const [loadingData, setLoadingData] = useState(true);

  const [name, setName] = useState("");
  const [isHot, setIsHot] = useState(false);
  const [replacementDay, setReplacementDay] = useState(0);
  const [Images, setImages] = useState([]);

  const [newImages, setNewImages] = useState([]);
  const [fileImages, setFileImages] = useState([]);

  //CATEGORIES METAL POT ETC.
  const [categories, setCategories] = useState([]);
  const [newCategories, setNewCategories] = useState([]);

  const [deletedCategories, setDeletedCategories] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [deletedVariants, setDeletedVariants] = useState([]);

  const [variants, setVariants] = useState([]);
  const [newVariants, setNewVariants] = useState([]);
  const [newVarName, setNewVarName] = useState("");
  const [varPrice, setVarPrice] = useState('');
  const [varStock, setVarStock] = useState('');

  const [description, setDescription] = useState("");

  const [catechoser, setCatechoser] = useState(false);
  const [availableCategories, setAvailableCategories] = useState([]);

  const [Urls, setUrls] = useState([])
  const [uploading, setUploading] = useState(false)

  const [perc, setPerc] = useState(0)

  const loadSomething = async () => {
    try {
      setLoadingData(true);
      const response = await API.get("/browse/getCategories");
      setAvailableCategories(response.data.categories);
      if (mode !== 0) {
        const prod = await API.post(`/admin/getproductdetail/${data._id}`, {
          auth: getAuth(),
        });
        setName(prod.data.productData.name);
        setCategories(prod.data.productData.categories);
        setIsHot(prod.data.productData.is_hot);
        setReplacementDay(prod.data.productData.replacement_day);
        setImages(prod.data.productData.Images);
        setDescription(prod.data.productData.description);
        setVariants(prod.data.productData.variants);
      }
      setLoadingData(false);
    } catch (e) {}
  };

  const saveImage = async (data) => {
    try {
      const response = await API.post("/admin/uploadProductImage", {
        mode,
        _id,
        prod_Id : data._id,
        images : Urls,
        auth : getAuth()
      });
      setNewImages([]);
      setUrls([])
      return response.data;
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

  const handleUpload = (filesIMGS) => {
    setUploading(true)
    const promises = [];
    let IMGS = []

    for( var i = 0; i < filesIMGS.length; i++){
        const IMG_FILE = filesIMGS[i]
        IMGS.push(IMG_FILE)
    }

    IMGS.map((image) => {
      console.log("HANDLE UPLOAD");
      const storageRef = ref(storage, `/products/${uuidv4()}_${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);
      promises.push(uploadTask);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setPerc(percent);
        },
        (err) => console.log(err),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => { setUrls((prev) => [...prev, url]) });
        }
      );
    });

    Promise.all(promises)
      .then(() => {
        console.log("Uploaded Images..")
        console.log(Urls)
        setUploading(false)
        setPerc(0)
      })
      .catch((err) => console.log(err));
  };

  const save = async () => {
    setLoadingData(true)
    try {
      // mode , _id, prod_Id, simpleData
      if (mode === 1) {
        if (newImages.length !== 0) await saveImage(productData);
        const response = await API.post("/admin/updateProduct", {
          mode,
          _id,
          prod_Id: data._id,
          simpleData: {
            name,
            replacement_day: replacementDay,
            description,
            is_hot: isHot,
          },
          complexData: {
            newCategories,
            deletedCategories,
            deletedImages,
            newVariants,
            deletedVariants,
          },
          auth: getAuth(),
        });
      } else {
        const response = await API.post("/admin/updateProduct", {
          mode,
          _id,
          simpleData: {
            name,
            replacement_day: replacementDay,
            description,
            is_hot: isHot,
          },
          complexData: {
            newCategories,
            deletedCategories,
            deletedImages,
            newVariants,
            deletedVariants,
          },
          auth: getAuth(),
        });

        if (newImages.length !== 0) await saveImage(response.data);

        dispatch(closeInputModal());
      }

      onSave();
      loadSomething();
      setDeletedCategories([]);
      setDeletedImages([]);
      setDeletedVariants([]);
      setNewCategories([]);
      setNewVariants([]);
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

  useEffect(() => {
    loadSomething();
  }, []);

  return (
    <div className="">
      <div className="max-h-xl overflow-y-auto my-4 px-2 py-2">
        <h1 className="text-xl font-medium">Product Information</h1>
        {loadingData ? (
          <Loader />
        ) : (
          <>
            <HelperLabel
              isError={false}
              bg={"bg-teal-50"}
              txtbg={"text-teal-600"}
              msg={"Changes will only apply after saving"}
            />
            <p className="my-4 text-md text-teal-700 font-medium">Basic</p>
            {mode !== 0 && (
              <p className="my-4 font-medium text-teal-600 flex items-center px-2 filter py-2 bg-green-50 rounded">
                <GiDna1 /> ID:{" "}
                <span className="italic text-gray-600">{productData._id}</span>
              </p>
            )}
            <div className="mt-3 relative w-full mr-3 text-green-900 h-full  focus-within:text-green-700 ">
              <Label>
                <span className="text-teal-800">Product Name</span>
                <Input
                  className="mt-2 rounded-lg border-1 bg-gray-100 transition duration-500 text-gray-600 hover:text-gray-700 focus:text-gray-700"
                  placeholder=""
                  rows="8"
                  aria-label="New Number"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </Label>
              {name.length === 0 && (
                <HelperLabel isError={true} msg={"Please provide a name"} />
              )}
              <Label className="mt-4" check>
                <Input
                  checked={isHot}
                  onChange={(e) => setIsHot(e.target.checked)}
                  type="checkbox"
                />
                <span className="ml-2 flex items-center text-gray-400">
                  <AiTwotoneFire className=" mr-2" />
                  Set As New Arrival
                </span>
              </Label>
              <HelperLabel
                isError={false}
                bg={"bg-teal-50"}
                txtbg={"text-teal-600"}
                msg={
                  "Hot products will be featured at the landing page of Astig03"
                }
              />

              {mode !== 0 && (
                <>
                  <p className="mt-6 text-md text-teal-700 font-medium">
                    Stats
                  </p>

                  <div className="flex mb-6 mt-4 justify-evenly items-center">
                    <div className="flex text-yellow-400 font-medium items-center h-full">
                      <AiFillStar className=" mr-4" />
                      <p>
                        {(productData.n_no_ratings === 0
                          ? 0
                          : ((productData.n_ratings /
                              (productData.n_no_ratings * 10)) *
                              100) /
                            10
                        ).toFixed(1)}{" "}
                        Rating
                      </p>
                    </div>
                    <div className="flex text-orange-500 font-medium items-center h-full">
                      <BsHeartFill className="text-red-400 mr-4" />
                      <p>{nShorter(productData.likes, 1)} Likes</p>
                    </div>

                    <div className="flex text-teal-500 font-medium items-center h-full">
                      <FaCoins className=" mr-4" />
                      <p>
                        Php {numberWithCommas(productData.generated_sale)} Sale
                      </p>
                    </div>
                    <div className="flex text-blue-600 font-medium items-center h-full">
                      <FaTruckLoading className=" mr-4" />
                      <p>{productData.total_item_sold} Sold</p>
                    </div>
                  </div>

                  <Label className="mt-4">
                    <span className="text-teal-800 mb-2">Replacement Day</span>
                    <HelperLabel
                      isError={false}
                      bg={"bg-teal-50"}
                      txtbg={"text-teal-600"}
                      msg={
                        "Replacement day define how many days customer may return a product with defect"
                      }
                    />
                    <Input
                      className="mt-4 rounded-lg border-1 bg-gray-100 transition duration-500 text-gray-600 hover:text-gray-700 focus:text-gray-700"
                      placeholder=""
                      rows="8"
                      aria-label="New Number"
                      value={replacementDay}
                      onChange={(e) => {
                        setReplacementDay(e.target.value);
                      }}
                    />
                  </Label>
                </>
              )}
            </div>

            {/* Category */}
            <div className="z-10 border-b-2 mt-8 pb-4">
              <p className="text-md text-teal-700 font-medium">
                Product Category
              </p>
              <div className="mx-auto ">
                <div className="relative">
                  <Button
                    onClick={() => setCatechoser(true)}
                    className="my-2 relative bg-teal-400 text-white mt-5 rounded-md shadow-lg text-center active:bg-teal-500 cursor-default focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  >
                    <span className="flex items-center">
                      <span className="block truncate">Add Category</span>
                    </span>
                  </Button>
                  <Dropdown
                    className="filter shadow-xl"
                    isOpen={catechoser}
                    onClose={() => setCatechoser(false)}
                  >
                    {availableCategories.map((ctgry, idx) => (
                      <DropdownItem
                        className="justify-between hover:bg-gray-200"
                        key={idx}
                        onClick={() => {
                          setCatechoser(false);
                          if (categories.includes(ctgry.category_name)) return;
                          setNewCategories([
                            ...newCategories,
                            ctgry.category_name,
                          ]);
                        }}
                      >
                        <span>{ctgry.category_name}</span>
                        <Badge type="neutral">
                          {ctgry.associated_products.length}
                        </Badge>
                      </DropdownItem>
                    ))}
                  </Dropdown>
                </div>
                <HelperLabel
                  isError={false}
                  bg={"bg-teal-50"}
                  txtbg={"text-teal-600"}
                  msg={"User can search or filter product via category"}
                />
                <div className="rounded-sm shadow-md p-4 mt-2 max-h-44 overflow-y-auto">
                  {categories.length === 0 && newCategories.length === 0 ? (
                    <p className=" text-xs text-red-500 text-center">
                      Please Add Category
                    </p>
                  ) : (
                    <></>
                  )}

                  {categories.map((ctgry, idx) => (
                    <div
                      key={idx}
                      className="cursor-pointer hover:bg-gray-100  flex justify-between items-center px-4 py-2  rounded-sm border"
                    >
                      <div className="flex items-center">
                        {/* <BsFillTelephoneFill className="w-4 h-4 text-teal-600 cursor-pointer mr-4" /> */}
                        <p className="text-gray-600 italic">{ctgry}</p>
                      </div>
                      <MdOutlineClose
                        onClick={() => {
                          setCategories(
                            categories.filter((ct) => ct !== ctgry)
                          );
                          setDeletedCategories([...deletedCategories, ctgry]);
                        }}
                        className="cursor-pointer text-gray-400 hover:text-red-600 hover:shadow-2xl rounded-full"
                      />
                    </div>
                  ))}
                  {newCategories.map((ctgry, idx) => (
                    <div
                      key={idx}
                      className="cursor-pointer hover:bg-gray-100  flex justify-between items-center px-4 py-2  rounded-sm border"
                    >
                      <div className="flex items-center">
                        {/* <BsFillTelephoneFill className="w-4 h-4 text-teal-600 cursor-pointer mr-4" /> */}
                        <p className="text-gray-600 italic">{ctgry}</p>
                      </div>
                      <MdOutlineClose
                        onClick={() => {
                          setNewCategories(
                            newCategories.filter((ct) => ct !== ctgry)
                          );
                        }}
                        className="cursor-pointer text-gray-400 hover:text-red-600 hover:shadow-2xl rounded-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Variant */}
            <div className="z-10 border-b-2 mt-8 pb-4">
              <p className="text-md text-teal-700 font-medium">New Variant</p>
              <div className="mx-auto ">
                <HelperLabel
                  isError={false}
                  bg={"bg-teal-50"}
                  txtbg={"text-teal-600"}
                  msg={"You can add variant with different prices"}
                />
                <div className=" flex items-center">
                  <div className="my-4 w-full mr-3 text-green-900 h-full  focus-within:text-green-700 ">
                    <Input
                      className=" rounded-lg border-1 bg-gray-100 transition duration-500 text-gray-600 hover:text-gray-700 focus:text-gray-700"
                      placeholder="Variant Name"
                      aria-label="New Number"
                      value={newVarName}
                      onChange={(e) => {
                        setNewVarName(e.target.value);
                      }}
                    />
                  </div>
                  <div className=" w-full mr-3 text-green-900 h-full  focus-within:text-green-700 ">
                    <Input
                      className=" rounded-lg border-1 bg-gray-100 transition duration-500 text-gray-600 hover:text-gray-700 focus:text-gray-700"
                      placeholder="Price"
                      aria-label="New Number"
                      value={varPrice}
                      onChange={(e) => {
                        setVarPrice(e.target.value);
                      }}
                    />
                  </div>
                  <div className=" w-full mr-3 text-green-900 h-full  focus-within:text-green-700 ">
                    <Input
                      className=" rounded-lg border-1 bg-gray-100 transition duration-500 text-gray-600 hover:text-gray-700 focus:text-gray-700"
                      placeholder="Stock"
                      aria-label="New Number"
                      value={varStock}
                      onChange={(e) => {
                        if (e.target.value === "") setVarStock("");
                        if (isNaN(Number.parseInt(e.target.value))) return;
                        let stock = Number.parseInt(e.target.value);
                        setVarStock(stock);
                      }}
                    />
                  </div>
                  <Button
                    disabled={
                      varPrice.length === 0 ||
                      newVarName.length === 0 ||
                      varStock.length === 0
                    }
                    onClick={() => {
                      // check if its in default vars
                      let hasSameVariant = variants.filter((i, idx) => {
                        if (i.name === newVarName)
                          setDeletedVariants([...deletedVariants, newVarName]);
                        return i.name === newVarName;
                      });

                      if (hasSameVariant)
                        setVariants(
                          variants.filter((vr) => vr.name !== newVarName)
                        );

                      // check if its in new var
                      let hasInNewVariant = newVariants.filter((i, idx) => {
                        return i.name === newVarName;
                      });

                      console.log(hasInNewVariant, newVariants);

                      let toSpread = newVariants

                      if (hasInNewVariant)
                        toSpread = newVariants.filter((vr) => vr.name !== newVarName)


                      setNewVariants([
                        ...toSpread,
                        {
                          name: newVarName,
                          price: Number.parseFloat(varPrice),
                          stock: varStock,
                        },
                      ]);
                      setNewVarName("");
                      setVarPrice("");
                      setVarStock("");
                    }}
                    className=" relative bg-teal-400 text-white  rounded-md shadow-lg text-center active:bg-teal-500 cursor-default focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  >
                    <span className="flex items-center">
                      <span className="block truncate">Add Variant</span>
                    </span>
                  </Button>
                </div>
                {variants.length === 0 && newVariants.length === 0 ? (
                  <HelperLabel
                    isError={true}
                    msg={"Please add atleast 1 variant"}
                  />
                ) : (
                  <></>
                )}
                <TableContainer className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableCell>Variant</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Stock</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {variants.map((vrnt, idx) => (
                        <TableRow
                          onClick={() => {}}
                          key={idx}
                          className="transition cursor-pointer hover:bg-gray-100 duration-400"
                        >
                          <TableCell className="text-teal-900 ">
                            <div>
                              <p>{vrnt.name}</p>
                            </div>
                          </TableCell>

                          <TableCell>
                            <p className="text-gray-500">
                              <span className=" font-medium">{vrnt.price}</span>
                            </p>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium text-teal-600">
                              {vrnt.stock}
                            </p>
                          </TableCell>
                          <TableCell>
                            <div
                              className="text-red-400 flex items-center"
                              onClick={() => {
                                setVariants(
                                  variants.filter((vr) => vr.name !== vrnt.name)
                                );
                                setDeletedVariants([
                                  ...deletedVariants,
                                  vrnt.name,
                                ]);
                              }}
                            >
                              <RiCloseLine />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {newVariants.map((vrnt, idx) => (
                        <TableRow
                          onClick={() => {}}
                          key={idx}
                          className="transition cursor-pointer hover:bg-gray-100 duration-400"
                        >
                          <TableCell className="text-teal-900 ">
                            <div>
                              <p>{vrnt.name}</p>
                            </div>
                          </TableCell>

                          <TableCell>
                            <p className="text-gray-500">
                              <span className=" font-medium">{vrnt.price}</span>
                            </p>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium text-teal-600">
                              {vrnt.stock}
                            </p>
                          </TableCell>
                          <TableCell>
                            <div
                              className="text-red-400 flex items-center"
                              onClick={() => {
                                setNewVariants(
                                  newVariants.filter(
                                    (vrt) => vrt.name !== vrnt.name
                                  )
                                );
                              }}
                            >
                              <RiCloseLine />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>

            {/* Description */}
            <div className="mt-3 w-full mr-3 text-green-900  focus-within:text-green-700 ">
              <Label>
                <p className="text-md text-teal-700 font-medium">
                  Product Description
                </p>

                <Textarea
                  className="leading-6 mt-2 rounded-lg border-1 bg-gray-50 transition duration-500 text-gray-600 hover:text-gray-700 focus:text-gray-700"
                  placeholder="Product Description"
                  aria-label="New Number"
                  value={description}
                  rows={8}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                />
              </Label>
              {description.length === 0 && (
                <HelperLabel
                  isError={true}
                  msg={"Please provide a product description"}
                />
              )}
            </div>

            {/* Product Images */}
            <div className="mt-6">
              <p className="text-md text-teal-700 font-medium">Product Image</p>

              <input
                className="my-4 form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-teal-600 focus:outline-none"
                type="file"
                accept="image/png, image/gif, image/jpeg"
                onChange={(e) => {
                  setFileImages(e.target.files);
                  handleUpload(e.target.files)
                  setNewImages(() => {
                    let urlImages = [...newImages];
                    let fileArr = Array.from(e.target.files);
                    fileArr.forEach((fileurl) => {
                      urlImages.push(URL.createObjectURL(fileurl));
                    });
                    return urlImages;
                  });
                }}
                multiple
              />
              <HelperLabel
                isError={false}
                bg={"bg-teal-50"}
                txtbg={"text-teal-600"}
                msg={"You can add more photo"}
              />
              <div class="container px-5 mx-auto mb-6 mt-4 lg:pt-12">
                <div class="flex flex-wrap md:-m-3">
                  {Images.map((url, idx) => (
                    <div class="flex flex-wrap w-1/3">
                      <div class="relative w-full p-1 md:p-2">
                        <img
                          alt={url}
                          class="block object-cover object-center w-full h-full rounded-lg"
                          src={url}
                        />
                        <MdOutlineClose
                          onClick={() => {
                            setImages(Images.filter((img) => img !== url));
                            setDeletedImages([...deletedImages, url]);
                          }}
                          className="right-0 top-0 bg-gray-50 h-4 w-4 filter shadow-md absolute cursor-pointer text-gray-400 hover:text-red-600 hover:shadow-2xl rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                  {newImages.map((url, idx) => (
                    <div class="flex flex-wrap w-1/3 border-2 border-dashed rounded">
                      <div class="relative w-full p-1 md:p-2">
                        <img
                          alt={url}
                          class="block object-cover object-center w-full h-full rounded-lg"
                          src={url}
                        />
                        <span class="top-1 right-1 animate-ping absolute inline-flex h-5 w-5 rounded-full bg-blue-300 opacity-75"></span>
                        <span class="top-1 right-1 absolute inline-flex rounded-full h-4 w-4 bg-blue-400"></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {newImages.length === 0 && Images.length === 0 && (
                <div className="">
                  <MdHideImage className="text-gray-200 mx-auto h-1/6 w-1/6" />
                  <p className="text-center font-center text-red-400">
                    No image, please add at least 1 image
                  </p>
                </div>
              )}
              {uploading && (
                <HelperLabel
                  isError={false}
                  bg={"bg-indigo-50"}
                  txtbg={"text-indigo-600"}
                  msg={`uploading photos - ${perc} %`}
                />
              )}
            </div>
          </>
        )}
      </div>

      <Button
        className="rounded-lg w-full mt-8"
        disabled={
          loadingData ||
          name.length === 0 ||
          (categories.length === 0 && newCategories.length === 0) ||
          (variants.length === 0 && newVariants.length === 0) ||
          description.length === 0 ||
          (Images.length === 0 && newImages.length === 0) || uploading
        }
        onClick={async (e) => {
          e.stopPropagation();
          save();
        }}
      >
        {uploading ? "Uploading Images" : "Save"}
      </Button>
    </div>
  );
};

export default ProductView;
