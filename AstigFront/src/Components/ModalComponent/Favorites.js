import React, { useState, useEffect } from "react";
import { withRouter, useHistory } from "react-router-dom";
import { BsHeartFill } from "react-icons/bs";
import { AiFillHeart } from "react-icons/ai";
import API from "../../Helpers/api";

import Loader from "../admin/Loader";

import { Button } from "@windmill/react-ui";
import { getAuth, nShorter } from "../../Helpers/uitils"

const Favorites = ({ _id  }) => {
  const [loadingData, setLoadingData] = useState(true);
  const [productLiked, setProductLiked] = useState([]);

  const history = useHistory()

  const loadSomething = async () => {
    try {
      const response = await API.post(`/user/getLiked/${_id}`, { auth : getAuth() });
      setLoadingData(false);
      setProductLiked(response.data.liked_products);
    } catch (e) {}
  };

  useEffect(() => {
    loadSomething();
  }, []);

  return (
    <div className="w-full">
      {loadingData && <Loader />}
      {!loadingData && (
        <>
          <div className="flex items-center space-x-3">
            <BsHeartFill className="h-6 w-6 defTextCol2" />
            <p className="text-xl">{productLiked.length} Liked Products</p>
          </div>
          <div className="mx-4 my-4 overflow-y-auto h-96 rounded-md      scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
            {productLiked.map((prod, idx) => (
              <div key={idx} className="flex items-center w-full ">
                <img
                  className="my-4 w-2/5 object-cover rounded-xl"
                  src={prod.Images[0]}
                  alt={prod.name}
                ></img>
                <div className="ml-3 space-y-4 w-full mx-2">
                  <p className="text-lg">{prod.name}</p>
                  <div className="flex items-center space-x-1">
                    <AiFillHeart className="text-red-400 w-7 h-7" />
                    <p>{nShorter(prod.likes,1)} likes</p>
                  </div>
                  <Button onClick={() => { 
                      history.push(`/productdetail/${prod._id}`) 
                    }} className=" w-full text-white font-inter py-2 px-4 rounded">
                    View Product Info
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default withRouter(Favorites);
