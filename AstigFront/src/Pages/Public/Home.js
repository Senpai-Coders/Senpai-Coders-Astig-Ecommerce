import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";

/* Swipedesu */
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination, Controller, Thumbs } from "swiper";
import "swiper/swiper-bundle.css";

/* AXIOS API */
import API from "../../Helpers/api";
import { getUrl } from "../../Helpers/uitils";

/*Windmill Components*/
import { Badge, Button } from "@windmill/react-ui";

import { motion } from "framer-motion";

/* Icons */
import { BsFillClockFill } from "react-icons/bs";
import { AiFillCloseCircle, AiFillCheckCircle } from "react-icons/ai";

SwiperCore.use([Navigation, Pagination, Controller, Thumbs]);
const Home = (props) => {
  const [hotProducts, setHotProducts] = useState([]);
  useEffect(()=>{window.scrollTo(0, 0);},[])

  useEffect(() => {
    const getHotProducts = async () => {
      try {
        const data = await API.get("/browse/gethotproducts");
        setHotProducts(data.data);
      } catch (e) {
        console.log("ERR", e);
      }
    };
    getHotProducts();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.75 }}
    >
      <section className=" text-gray-600 flex justify-center body-font mt-32">
        <div className="m-8 md:flex rounded-md justify-center items-center md:max-w-screen-xl">
          <img
            className="w-full md:w-1/2"
            src={getUrl("/static/assets/collage.jpg")}
          ></img>
          <div className="w-full md:w-1/2 h-11/12 md:h-full bg-gray-200 flex items-center">
            <div className="mx-16">
              <p className="font-inter text-xl text-black">ASTIG03</p>
              <p className="mt-6 tracking-wider font-inter text-4xl leading-normal font-extrabold text-black">
                Your Shopping Venture Starts Here
              </p>
              <p className="my-6">
                Check out more products that suit your style
              </p>
              <Button
                className="rounded-none font-inter cursor-pointer border borderDefCol registerStyle "
                tag={Link}
                to="/products"
              >
                VIEW PRODUCTS
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="text-gray-600 body-font md:mx-16 mt-20">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap w-full mb-20">
            <div className="lg:w-1/2 w-full mb-6 lg:mb-0 flex items-center">
              <div className="h-1 w-20 bg-gray-900 rounded mr-8"></div>
              <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 defText-Col-2">
                Discover NEW Arrivals
              </h1>
            </div>
          </div>
          <Swiper
            className="p-5"
            pagination={{ clickable: true, dynamicBullets: true }}
            navigation={true}
            tag="div"
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1440: {
                slidesPerView: 4,
                spaceBetween: 40,
              },
            }}
            slidesPerView={3}
            spaceBetween={20}
          >
            {hotProducts.map((prod, idx) => (
              <SwiperSlide key={idx} className="">
                <Link
                  to={`/productdetail/${prod._id}`}
                  className="rounded-lg m"
                >
                  <img
                    className="h-60 rounded-lg w-full object-cover object-center mb-4"
                    src={prod.Images[0]}
                    alt="content"
                  />
                  <h1 className="text-lg font-inter font-semibold defText-Col-2">
                    {prod.name}
                  </h1>
                  <p className="text-xs mt-2">Wood Sign</p>
                  <div className="flex justify-between mt-3">
                    <div className="flex items-center">
                      {prod.total_stock !== 0 ? (
                        <span className="bg-gray-100 text-gray-800 text-lg font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">New Arrival</span>
                      ) : (
                        <span className="bg-red-200 text-gray-800 text-lg font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">No Stock</span>
                      )}
                    </div>
                    <p className="font-inter defText-Col-2 text-xl">
                      <span className="font-semibold text-lg">Php</span>{" "}
                      {prod.variants[0].price}
                    </p>
                  </div>
                  <div className="flex mt-4 text-gray-400 mb-16">
                    <Button className="registerStyle border-2 borderDefCol" block>View</Button>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
          {
              hotProducts.length === 0 && <p className="text-center defTextCol text-sm"> sorry, no products to show</p>
          }
        </div>
      </section>

      <div className="max-w-screen-xl p-4 bg-white dark:bg-gray-800 mx-auto px-4 sm:px-6 lg:px-8 relative py-26 lg:mt-20">
        <div className="relative  font-inter ">
          <div className="lg:grid lg:grid-flow-row-dense lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div className="lg:col-start-2 lg:max-w-2xl ml-auto">
              <div className="w-full mb-6 lg:mb-0 flex items-center">
                <div className="h-1 w-20 bg-gray-900 rounded mr-8"></div>
                <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 defText-Col-2">
                  Why Astig03?
                </h1>
              </div>
              <h4 className="mt-2 text-2xl leading-8 font-medium text-teal-900  sm:text-3xl sm:leading-9">
                We offer latest trends, unique and stylish products from our
                store for a cheaper price
              </h4>
              <ul className="mt-8 md:grid md:grid-cols-2 gap-6">
                <li className="mt-6 lg:mt-0">
                  <div className="flex">
                    <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-800 dark:text-green-500 drark:bg-transparent">
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </span>
                    <span className="ml-4 text-base leading-6 font-medium text-gray-500 dark:text-gray-200">
                      Cheap but quality products
                    </span>
                  </div>
                </li>
                <li className="mt-6 lg:mt-0">
                  <div className="flex">
                    <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-800 dark:text-green-500 drark:bg-transparent">
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </span>
                    <span className="ml-4 text-base leading-6 font-medium text-gray-500 dark:text-gray-200">
                      Courier Flexibility
                    </span>
                  </div>
                </li>
                <li className="mt-6 lg:mt-0">
                  <div className="flex">
                    <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-800 dark:text-green-500 drark:bg-transparent">
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </span>
                    <span className="ml-4 text-base leading-6 font-medium text-gray-500 dark:text-gray-200">
                      Safe & easy transaction
                    </span>
                  </div>
                </li>
              </ul>
            </div>
            <div className="mt-10 lg:-mx-4 relative relative-20 lg:mt-0 lg:col-start-1">
              <div className="relative space-y-4">
                <div className="flex items-end justify-center lg:justify-start space-x-4">
                  <motion.img
                    className="rounded-lg shadow-lg w-32 md:w-56"
                    width="200"
                    src={getUrl("/static/assets/b16 - MEADOW Luggage Bag.jpg")}
                    alt="1"
                  />
                  <img
                    className="rounded-lg shadow-lg w-40 md:w-64"
                    width="260"
                    src={getUrl("/static/assets/a4 - BENIR.jpg")}
                    alt="2"
                  />
                </div>
                <div className="flex items-start justify-center lg:justify-start space-x-4 ml-12">
                  <img
                    className="rounded-lg shadow-lg w-24 md:w-40"
                    width="170"
                    src={getUrl("/static/assets/Princess Elsa_.jpg")}
                    alt="3"
                  />
                  <img
                    className="rounded-lg shadow-lg w-32 md:w-56"
                    width="200"
                    src={getUrl("/static/assets/The Flash.jpg")}
                    alt="4"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className=" w-full h-screen flex items-center font-quicksand">
        <aside className="w-full md:mx-8 overflow-hidden h-5/6 text-gray-300 bg-gray-900 rounded-xl lg:flex">
          <div className="w-full lg:w-1/2 p-8 text-center sm:p-16 lg:p-24 lg:text-left flex items-center">
            <div className="max-w-xl mx-auto lg:ml-0">
              <p className="mt-2 text-2xl text-white sm:text-3xl">
                {" "}
                <span className=" font-bold "></span>
              </p>

              <p className="order-3 lg:mt-4 lg:block leading-8 text-xl text-justify italic">
                <span className="text-3xl font-bold">" </span>Way back in 2020,
                my daughter joined a beauty pageant, Astig03 gives me a lot of
                choices when it comes to clothing, costumes and shoes. I highly
                recommend this store 100%
                <span className="text-3xl font-bold"> "</span>
              </p>
              <p className=" mt-8 text-xl text-gray-100">
                {" "}
                - Mr. Andrei Castro (Co-Founder of Lisa IT Tech)
              </p>
            </div>
          </div>

          <div
            style={{
              backgroundImage: `url('${getUrl("/static/assets/andrei.jpg")}')`,
            }}
            className="flex items-center relative bg-cover w-full h-screen sm:h-96 lg:w-1/2 lg:h-auto"
          >
            <div className="flex items-center justify-center w-full h-full filter backdrop-filter backdrop-blur-sm">
              <img
                src={getUrl("/static/assets/andrei.jpg")}
                alt="Testimonial"
                className="mx-auto my-8 rounded-xl absolute inset-0 object-cover w-8/12 "
              />
            </div>
          </div>
        </aside>
      </div>
    </motion.div>
  );
};

export default withRouter(Home);
