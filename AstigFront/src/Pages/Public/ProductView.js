import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openAlertModal, closeInputModal } from "../../Features/uiSlice";
import { signin } from "../../Features/userSlice";
import { useParams } from "react-router-dom";

import { Badge, Input, Button, Avatar, Textarea } from "@windmill/react-ui";

import API from "../../Helpers/api";
import { getAuth } from "../../Helpers/uitils"

import { parseDate } from "../../Helpers/uitils";

import FullPageLoader from "../../Components/FullPageLoader";
import HelperLabel from "../../Components/HelperLabel";

import Informative from "../../Components/Modal/Informative";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination, Controller, Thumbs } from "swiper";
import "swiper/swiper-bundle.css";

import {
  AiFillCloseCircle,
  AiOutlineHeart,
  AiFillHeart,
  AiFillStar,
} from "react-icons/ai";
import { HiFire } from "react-icons/hi";
import {
  BsFillCalendarCheckFill,
  BsShieldCheck,
  BsCheckCircle,
  BsFillClockFill,
} from "react-icons/bs";
import { CgDetailsLess } from "react-icons/cg"
import { FaShapes } from "react-icons/fa"

import { motion } from "framer-motion";

const ProductView = () => {
  const [loading, setLoading] = useState(true);
  const [productDetail, setProductDetail] = useState();

  const [selectedVariant, setSelectedVariant] = useState({});
  const [liked, setLiked] = useState(false);

  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(-1);
  const [commentUpload, setCommentUpload] = useState(false);

  const [selImage, setSelImage] = useState("");

  const [QTY, setQTY] = useState(1);

  const { prod_id } = useParams();

  const dispatch = useDispatch();

  const _cur_user = useSelector((state) => state.user.userData);

  const parseCategories = (cats) => {
      let cat = ''
      
      for( let x = 0; x < cats.length; x++){
        cat += `#${cats[x]}${x !== cats.length-1 ? ", " : ""}`
      }

      return cat
  }

  const checkIfAlreadyInCart = (item, cart) => {
    let found = null;

    cart.forEach((cart_item, idx) => {
      if (
        cart_item.product_ID === item.product_ID &&
        cart_item.variant === selectedVariant.name
      )
        found = {
          idx,
          cart_item,
        };
    });
    return found;
  };

  const addToCart = async () => {
    if (!_cur_user) {
      dispatch(
        openAlertModal({
          component: <Informative />,
          data: {
            description: "You are not signed in",
            solution: "Please Sign In First",
          },
        })
      );
      return;
    }

    try {
      const doesExist = checkIfAlreadyInCart(
        {
          thumb: productDetail.Images[0],
          product_ID: prod_id,
          product_name: productDetail.name,
          qty: QTY,
          variant: selectedVariant.name,
          variant_price: selectedVariant.price,
          rated: false,
        },
        _cur_user.cart.items
      );

      if (doesExist) {
        //check if current qty + from user cart qty is not > the avail stock of product

        let qty_in_cart = doesExist.cart_item.qty + QTY;

        if (qty_in_cart > selectedVariant.stock) {
          dispatch(
            openAlertModal({
              component: <Informative />,
              data: {
                description: "Sorry failed to add",
                solution: `You already have ${doesExist.cart_item.qty} on your cart, adding qty of ${QTY} will exceed the current stock of ${selectedVariant.stock}. Please change the quantity`,
              },
            })
          );
          return;
        }

        let CART = { ..._cur_user.cart };

        CART.items = CART.items.filter((item, idx) => idx !== doesExist.idx);
        CART.total_items = CART.items.length;
        CART.total_cost -=
          doesExist.cart_item.variant_price * doesExist.cart_item.qty;

        let response = await API.post("/user/updatecart", {
          _id: _cur_user._id,
          cart: CART,
          auth : getAuth()
        });

        await API.post("/user/addToCart", {
          auth : getAuth(),

          _id: _cur_user._id,
          item: {
            thumb: productDetail.Images[0],
            product_ID: prod_id,
            product_name: productDetail.name,
            qty: qty_in_cart,
            variant: selectedVariant.name,
            variant_price: selectedVariant.price,
            rated: false,
          },
        });

        dispatch(
          openAlertModal({
            component: <Informative />,
            data: {
              description: "Item Added",
              solution: "The items was added to your cart!",
            },
          })
        );

        response = await API.post(`/user/mydetails/${_cur_user._id}`, { auth : getAuth() });
        dispatch(signin(response.data.userData));

        return;
      }

      await API.post("/user/addToCart", {
        _id: _cur_user._id,
        item: {
          thumb: productDetail.Images[0],
          product_ID: prod_id,
          product_name: productDetail.name,
          qty: QTY,
          variant: selectedVariant.name,
          variant_price: selectedVariant.price,
          rated: false,
        },
        auth : getAuth()
      });

      dispatch(
        openAlertModal({
          component: <Informative />,
          data: {
            description: "Item Added",
            solution: "The items was added to your cart!",
          },
        })
      );

      const response = await API.post(`/user/mydetails/${_cur_user._id}`, { auth : getAuth() });
      dispatch(signin(response.data.userData));
    } catch (err) {
      console.log(err);
      dispatch(
        openAlertModal({
          component: <Informative />,
          data: {
            description: "Add To Cart Failed",
            solution: "Please Try Again Later!",
          },
        })
      );
    }
  };

  const checkIfQtyGivenValid = () => {
    return selectedVariant.stock < QTY || QTY <= 0;
  };

  const chechkIsNew = (date1) => {
    var currentDate = new Date().toJSON().slice(0, 10);
    var from = new Date(date1);
    var basis = new Date(date1);
    var to = new Date(basis.setMonth(basis.getMonth() + 2));

    var check = new Date(currentDate);

    let res = check > from && check < to;

    return res;
  };

  const getRating = () => {
    const N_r = productDetail.n_ratings;
    const N_no = productDetail.n_no_ratings;

    if (N_r === 0) return 0;

    let R = (N_r / (N_no * 10)) * 10;
    return R.toFixed(1) + "";
  };

  const selectVariant = (myVal) => {
    return selectedVariant === myVal
      ? "text-sm transition font-medium font-inter h-10 py-2 mx-1 px-5 border-4 borderDefCol rounded-3xl"
      : "text-sm transition font-extralight font-inter h-10 py-2 mx-1 mr-1 px-5 border-4 borderDefCol4 rounded-3xl";
  };

  const loadProductData = async (prod_id) => {
    try {
      setLoading(true);
      const resp = await API.get(`/browse/getproductdetail/${prod_id}`);
      let proddata = resp.data.productData;
      setProductDetail(proddata);

      try {
        let savedUser = JSON.parse(localStorage.getItem("userData"));
        const userResponse = await API.post(`/user/mydetails/${savedUser._id}`, { auth : getAuth() } );

        if (userResponse) {
          if (userResponse.data.userData.liked_products.includes(proddata._id))
            setLiked(true);
        }
      } catch (e) {}

      setSelectedVariant(proddata.variants[0]);
      setSelImage(proddata.Images[0]);

      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const writeComment = async (user_Id, prod_Id) => {
    try {
      /*
        const { user_Id ,prod_Id, comment_object } = req.body
        */
      const writeComment = await API.post("/user/writeComment", {
        user_Id,
        prod_Id,
        comment_object: {
          profile_picture: _cur_user.profile_picture,
          user_name: _cur_user.user_name,
          rating,
          comment,
          cat: new Date(),
        },
        auth : getAuth()
      });

      if (writeComment) {
        setCommentUpload(true);
        loadProductData(prod_id);
      }
    } catch (e) {}
  };

  const like = async () => {
    if (!_cur_user) {
      dispatch(
        openAlertModal({
          component: <Informative />,
          data: {
            description: "You are not signed in",
            solution: "Please Sign In First",
          },
        })
      );
      return;
    }
    try {
      const response = await API.post("/user/like", {
        mode: liked ? 1 : 0,
        _id: _cur_user._id,
        prod_Id: prod_id,
        auth : getAuth()
      });

      const resp = await API.get(`/browse/getproductdetail/${prod_id}`);
      let proddata = resp.data.productData;
      setProductDetail(proddata);

      setLiked(!liked);
    } catch (e) {}
  };

  const getSelectedStyle = (url) => {
    return url !== selImage
      ? "h-200 rounded-lg w-full object-cover object-center mb-4"
      : "h-200 rounded-lg w-full object-cover object-center mb-4 border-4 border-teal-500";
  };
  useEffect(()=>{window.scrollTo(0, 0);},[])

  useEffect(() => {
    dispatch(closeInputModal({}))
    loadProductData(prod_id);
  }, [prod_id]);

  return (
    <div className="min-h-screen">
      {loading ? (
        <FullPageLoader />
      ) : (
        <>
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-gray-600 body-font overflow-hidden"
          >
            <div className="container px-5 py-24 mx-auto">
              <div className="lg:w-4/5 mx-auto flex flex-wrap">
                {/* <img
                alt="ecommerce"
                className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
                src={productDetail.Images[0]}
              /> */}
                <div className="relative lg:w-1/2 w-full flex flex-col sm:mb-32 md:mb-96 justify-between">
                  <div className="hidden md:block h-96 bg-gray">
                    <img
                      alt="ecommerce"
                      className="object-contain duration-500 transition object-center rounded"
                      src={selImage}
                    />
                  </div>
                  <div className="md:h-4/12 md:absolute w-full sm:-bottom-24 md:-bottom-96 md:pt-8">
                    <Swiper
                      className="p-5"
                      pagination={{ clickable: true, dynamicBullets: true }}
                      navigation={true}
                      tag="div"
                      breakpoints={{
                        320: {
                          slidesPerView: 1,
                          spaceBetween: 0,
                        },
                        640: {
                          slidesPerView: 1,
                          spaceBetween: 0,
                        },
                        768: {
                          slidesPerView: 2,
                          spaceBetween: 0,
                        },
                        1024: {
                          slidesPerView: 3,
                          spaceBetween: 0,
                        },
                        1440: {
                          slidesPerView: 4,
                          spaceBetween: 0,
                        },
                      }}
                      slidesPerView={3}
                      spaceBetween={20}
                    >
                      {productDetail.Images.map((url, idx) => (
                        <SwiperSlide key={idx} className="mx-1">
                          <img
                            className={`${getSelectedStyle(url)} cursor-pointer duration-300`}
                            onClick={() => {
                              setSelImage(url);
                            }}
                            src={url}
                            alt="content"
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </div>
                <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                  <h2 className="text-sm title-font text-gray-500 tracking-widest"></h2>
                  <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                    {productDetail.name}
                  </h1>
                  <div className="flex mb-4">
                      <p className="text-sm text-cool-gray-500 break-words">
                        {parseCategories(productDetail.categories)}
                      </p>
                  </div>
                  <div>
                    {productDetail.is_hot && <Badge
                      type="success"
                      className="py-2 mx-1 px-4 flex items-center"
                    >
                      <HiFire className="defTextCol2 h-4 w-4 mr-2" />
                      New Arrival
                    </Badge>
                    }
                    {chechkIsNew(productDetail.cat) ? (
                      <Badge
                        type="success"
                        className="py-2 mx-1 px-4 flex items-center"
                      >
                        <BsFillCalendarCheckFill className="text-green-600 h-4 w-4 mr-2" />
                        New
                      </Badge>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="flex items-center">
                    <div className="flex justify-center my-4 mr-4 rounded-2xl bg-gray-100">
                      <h3 className="defText-Col-2 px-4 py-4 mx-8 text-4xl">
                        <span className="font-light text-xl mr-2">PhP</span>
                        {selectedVariant.price}
                      </h3>
                    </div>
                    <div>
                      {selectedVariant.stock !== 0 ? (
                        <div className="flex items-center">
                          <BsCheckCircle className="h-6 w-6 text-teal-400 mr-2" />
                          {selectedVariant.stock} items in stock
                        </div>
                      ) : (
                        <Badge
                          type="danger"
                          className="rounded-full px-4 my-2 mr-2 text-white p-2  leading-none flex items-center"
                        >
                          No stock
                          <AiFillCloseCircle className="ml-2"></AiFillCloseCircle>
                        </Badge>
                      )}
                      <div
                        className="flex items-center my-2 cursor-pointer text-gray-500 hover:text-red-500"
                        onClick={() => like()}
                      >
                        {!liked ? (
                          <AiOutlineHeart className="transition duration-200  w-7 h-7" />
                        ) : (
                          <AiFillHeart className="defTextCol2 w-7 h-7" />
                        )}
                        <p className="ml-1">{productDetail.likes} Likes</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <AiFillStar className="text-yellow-300 w-7 h-7 mr-2" />
                    <p>{getRating()} </p>
                    <div className="ml-5 flex items-center">
                      <BsShieldCheck className="text-teal-400 w-6 h-6 mr-2" />
                      {productDetail.replacement_day !== 0 ? (
                        <p>
                          {productDetail.replacement_day} Day(s) Defect
                          Replacement
                        </p>
                      ) : (
                        <p>Return of product is not available</p>
                      )}
                    </div>
                  </div>
                  <div className=" flex items-center mt-12  defTextCol">
                    <p className="font-bold ">Choose Variants</p><FaShapes className="ml-4 w-5 h-5"/>
                  </div>
                  <div className="flex flex-wrap my-5 defTextCol">
                    {productDetail.variants.map((variant, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedVariant(variant);
                        }}
                        className={selectVariant(variant)}
                      >
                        {variant.name}
                      </button>
                    ))}
                  </div>
                  <div className=" flex items-center mt-12 defTextCol">
                    <p className="font-bold ">Product Description</p><CgDetailsLess className="ml-4 w-5 h-5"/>
                  </div>
                  <pre className="leading-relaxed bg-transparent border-0 resize-none w-full py-4 font-inter">
                    {productDetail.description}
                  </pre>
                  <div className="my-7 flex items-center">
                    <h1 className="text-2xl font-medium">Quantity</h1>
                    <div className="w-2/12">
                      <Input
                        onChange={(e) => {
                          if (isNaN(e.target.value)) return;
                          if (e.target.value.length === 0) {
                            setQTY("");
                            return;
                          }
                          let val = Number.parseInt(e.target.value);
                          setQTY(val);
                        }}
                        value={QTY}
                        className="ml-4 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      ></Input>
                    </div>
                    <div>
                      <Button
                        className="ml-7 rounded-xl defBackground "
                        block
                        onClick={() => addToCart()}
                        disabled={checkIfQtyGivenValid()}
                      >
                        Add To Cart
                      </Button>
                    </div>
                  </div>
                  <div className="flex mt-4 text-gray-400 mb-16 items-center">
                    <BsFillClockFill className="w-3 h-3  mr-2"></BsFillClockFill>
                    <p className="text-xs">
                      Last update
                      {" " +
                        new Date(productDetail.uat).toLocaleString("en-us", {
                          month: "long",
                        }) +
                        " " +
                        new Date(productDetail.uat).getDate() +
                        ", " +
                        new Date(productDetail.uat).getFullYear()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
          {_cur_user && (
            <>
              {_cur_user.to_rate.includes(productDetail._id) && (
                <div className="w-full bg-pink-50 px-4 py-7 rounded-md border-dashed border-gray-200 shadow-md border">
                  {
                      !commentUpload && <div className="flex justify-evenly items-center px-8">
                      <p className="text-left  font-quicksand py-8 text-3xl leading-9">
                        You successfully purchased this product <br></br>Would you
                        like to rate & comment about this product?
                      </p>
                      <img
                        class="rounded-lg w-24 mx-auto md:w-32"
                        height="34"
                        src="https://192.168.1.5:3001/static/assets/comment.png"
                        alt="1"
                      />
                    </div>
                  }
                  {!commentUpload ? (
                    <>
                      <p className="text-center font-medium py-4 text-xs defTextCol">
                        Your comment will help us to further improve our
                        services
                      </p>
                      <div className="mx-4">
                        <Textarea
                          className="leading-6 mt-2 mb-4 rounded-lg border-1 bg-gray-50 transition duration-500 text-gray-600 hover:text-gray-700 focus:text-gray-700"
                          placeholder="Write Review"
                          aria-label="New Number"
                          value={comment}
                          rows={4}
                          onChange={(e) => {
                            setComment(e.target.value);
                          }}
                        />
                        {comment.length < 4 && (
                          <HelperLabel
                            isError={true}
                            msg={"Comment too short"}
                          />
                        )}
                        <p className="text-center mt-8 mb-2 defTextCol font-medium">
                          Please Rate 1-10
                        </p>
                        <div className="text-green-900 flex justify-evenly items-center my-4 focus-within:text-green-700 ">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n, idx) => (
                            <button
                            key={idx}
                              className={`px-4 py-2  transition duration-300 hover:text-white text-base rounded-lg w-full mt-2 mx-2 ${
                                rating === idx + 1
                                  ? "bg-teal-600 defTextCol4"
                                  : "bg-gray-50 defTextCol3"
                              } active:bg-teal-600 hover:bg-teal-500 focus:ring focus:ring-teal-300 `}
                              onClick={async (e) => {
                                setRating(idx + 1);
                              }}
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                        {comment.length < 4 && (
                          <HelperLabel
                            isError={true}
                            msg={"please select rating"}
                          />
                        )}
                        <Button
                          disabled={comment.length < 4 || rating === -1}
                          className="rounded-lg w-full mt-2 mb-8 text-lg py-4"
                          onClick={async (e) => {
                            e.stopPropagation();
                            writeComment(_cur_user._id, productDetail._id);
                          }}
                        >
                          save comment
                        </Button>
                      </div>
                    </>
                  ) : (
                    <p className="text-center font-medium py-4 text-xs text-teal-600">
                      Thank you! Your comment was saved successfully
                    </p>
                  )}
                </div>
              )}
            </>
          )}
          
          <section className="">
            <div class="max-w-screen-xl px-4 mt-8 py-8 mx-auto sm:px-6 lg:px-8">
              <h2 class="text-xl  sm:text-2xl">Customer Reviews</h2>

              <div class="flex items-center mt-4">
                <p class="text-3xl font-medium">
                  {getRating()}
                  <span class="sr-only"> Average review score </span>
                </p>

                <div class="ml-4">
                  <div class="flex -ml-1">
                    <AiFillStar className="text-yellow-300 mr-2 h-8 w-8" />
                  </div>

                  <p class="mt-0.5 text-xs text-gray-500">
                    Based on {productDetail.n_no_ratings} reviews
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-1 mt-8 lg:grid-cols-2 gap-x-16 gap-y-12">
                {productDetail.ratings.map((rating, idx) => (
                  <blockquote key={idx}>
                    <header class="sm:items-center sm:flex">
                      <div class="flex -ml-1">
                        <AiFillStar className="text-yellow-300 mr-2 h-5 w-5" />
                      </div>

                      <p class="mt-2 font-medium sm:ml-4 sm:mt-0">
                        {rating.rating}
                      </p>
                    </header>

                    <p class="mt-2 text-teal-800">{rating.comment}</p>

                    <footer class="mt-4 flex items-center">
                      <Avatar size="large" src={rating.profile_picture} />
                      <p class="ml-4 text-xs text-gray-500">
                        {rating.user_name} - {parseDate(rating.cat)}
                      </p>
                    </footer>
                  </blockquote>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default ProductView;
