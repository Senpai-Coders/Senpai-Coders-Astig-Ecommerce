import React, { useEffect, useState } from "react";
import HelperLabel from "../HelperLabel";
import Informative from "../Modal/Informative"
import { Input, Button } from "@windmill/react-ui"

import {useDispatch} from "react-redux"
import { closeInputModal, openAlertModal } from "../../Features/uiSlice";

import API from "../../Helpers/api"
import { getAuth } from "../../Helpers/uitils"

const AddressCreator = ({mode, gaddress, onSave, _id }) => {

  const dispatch = useDispatch()

  const [address, setAddress] = useState("");
  const [postal, setPostal] = useState("");
  const [street, setStreet] = useState("");
  const [barangay, setBarangay] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [region, setRegion] = useState("");

  const checkIfGaddress = () => {
    if (gaddress) {
      setAddress(gaddress.address);
      setPostal(gaddress.postal);
      setStreet(gaddress.street);
      setBarangay(gaddress.barangay);
      setCity(gaddress.city);
      setProvince(gaddress.province);
      setRegion(gaddress.region);
    }
  };

  useEffect(()=>{
    checkIfGaddress();
  },[])

  const saveAddress = async () => {
    try {
        const update = await API.post("/user/myaddress", {
            _id,
            address: {
                address,
                postal,
                street,
                barangay,
                city,
                province,
                region
            },
            oldAddress : gaddress,
            mode,
            auth : getAuth()
          });
        onSave()
        dispatch(closeInputModal());
      } catch (e) {
          console.log(e)
        dispatch(
          openAlertModal({
            component: <Informative />,
            data: {
              description: "Can't save changes",
              solution: "Try again later",
            },
          })
        );
      }
  }

  return (
    <div>
      <h1 className="text-xl">Address Information</h1>
      <HelperLabel
        isError={false}
        bg={"bg-teal-50"}
        txtbg={"text-teal-600"}
        msg={"Please make sure the information you provided is correct"}
      />
      <h1 className="text-xs mt-8 mb-4">Additional Information</h1>
      <div>
        <div className="mt-4 relative w-full mr-3 text-green-900 h-full  focus-within:text-green-700 ">
          {/* <div className="absolute inset-y-0 flex items-center pl-2">
            <MdEmail className="w-4 h-4 text-teal-600 cursor-pointer mr-4" />
          </div> */}
          <Input
            className=" rounded-lg border-0 bg-gray-100 transition duration-500 text-gray-600 hover:text-gray-700 focus:text-gray-700"
            placeholder="full address"
            aria-label="full"
            value={address}
            required={true}

            onChange={(e) => {
              setAddress(e.target.value);
            }}
          />
        </div>
        <div className="mt-4 relative w-full mr-3 text-green-900 h-full  focus-within:text-green-700 ">
          {/* <div className="absolute inset-y-0 flex items-center pl-2">
            <MdEmail className="w-4 h-4 text-teal-600 cursor-pointer mr-4" />
          </div> */}
          <Input
            className=" rounded-lg border-0 bg-gray-100 transition duration-500 text-gray-600 hover:text-gray-700 focus:text-gray-700"
            placeholder="postal"
            required={true}
            aria-label="full"
            value={postal}
            onChange={(e) => {
              setPostal(e.target.value);
            }}
          />
        </div>
        <div className="mt-4 relative w-full mr-3 text-green-900 h-full  focus-within:text-green-700 ">
          {/* <div className="absolute inset-y-0 flex items-center pl-2">
            <MdEmail className="w-4 h-4 text-teal-600 cursor-pointer mr-4" />
          </div> */}
          <Input
            className=" rounded-lg border-0 bg-gray-100 transition duration-500 text-gray-600 hover:text-gray-700 focus:text-gray-700"
            placeholder="Street"
            required={true}
            aria-label="full"
            value={street}
            onChange={(e) => {
              setStreet(e.target.value);
            }}
          />
        </div>
        <div className="mt-4 relative w-full mr-3 text-green-900 h-full  focus-within:text-green-700 ">
          {/* <div className="absolute inset-y-0 flex items-center pl-2">
            <MdEmail className="w-4 h-4 text-teal-600 cursor-pointer mr-4" />
          </div> */}
          <Input
            className=" rounded-lg border-0 bg-gray-100 transition duration-500 text-gray-600 hover:text-gray-700 focus:text-gray-700"
            placeholder="barangay"
            required={true}
            aria-label="full"
            value={barangay}
            onChange={(e) => {
              setBarangay(e.target.value);
            }}
          />
        </div>
        <div className="mt-4 relative w-full mr-3 text-green-900 h-full  focus-within:text-green-700 ">
          {/* <div className="absolute inset-y-0 flex items-center pl-2">
            <MdEmail className="w-4 h-4 text-teal-600 cursor-pointer mr-4" />
          </div> */}
          <Input
            className=" rounded-lg border-0 bg-gray-100 transition duration-500 text-gray-600 hover:text-gray-700 focus:text-gray-700"
            placeholder="city"
            required={true}
            aria-label="full"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
            }}
          />
        </div>
        <div className="mt-4 relative w-full mr-3 text-green-900 h-full  focus-within:text-green-700 ">
          {/* <div className="absolute inset-y-0 flex items-center pl-2">
            <MdEmail className="w-4 h-4 text-teal-600 cursor-pointer mr-4" />
          </div> */}
          <Input
            className=" rounded-lg border-0 bg-gray-100 transition duration-500 text-gray-600 hover:text-gray-700 focus:text-gray-700"
            placeholder="province"
            required={true}
            aria-label="full"
            value={province}
            onChange={(e) => {
              setProvince(e.target.value);
            }}
          />
        </div>
        <div className="mt-4 relative w-full mr-3 text-green-900 h-full  focus-within:text-green-700 ">
          <Input
            className=" rounded-lg border-0 bg-gray-100 transition duration-500 text-gray-600 hover:text-gray-700 focus:text-gray-700"
            placeholder="region"
            required={true}
            aria-label="region"
            value={region}
            onChange={(e) => {
              setRegion(e.target.value);
            }}
          />
        </div>
      </div>
      {(address.length === 0 || postal.length === 0 || street.length === 0  || barangay.length === 0 || city.length === 0 || province.length === 0 || region.length === 0)? (<HelperLabel
        isError={true}
        msg={"Please fill up all the input above"}
      />):''}
      <Button
        className="rounded-lg w-full mt-8"
        disabled={address.length === 0 || postal.length === 0 || street.length === 0  || barangay.length === 0 || city.length === 0 || province.length === 0 || region.length === 0}
        onClick={() => saveAddress()}
      >
        Save
      </Button>
    </div>
  );
};

export default AddressCreator;
