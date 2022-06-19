import React, { useEffect, useState } from "react";
import HelperLabel from "../../HelperLabel";
import { Input, Button } from "@windmill/react-ui";

import { useDispatch } from "react-redux";
import { closeInputModal, openAlertModal } from "../../../Features/uiSlice";

import API from "../../../Helpers/api";
import { getAuth} from "../../../Helpers/uitils"

const AddressCreator = ({ mode, gcategory, onSave, _id }) => {
  const dispatch = useDispatch();

  const [categoryName, setCategoryName] = useState("")
  const [associatedProducts, setAssociatedProducts] = useState([])

  const checkIfGCategory = () => {
    if (gcategory) {
        setCategoryName(gcategory.category_name)
        setAssociatedProducts(gcategory.associated_products)
    }
  };

  useEffect(() => { checkIfGCategory(); }, []);

  const save = async () => {
    try {
        const update = await API.post("/admin/updateCategories", {
          _id,
          category: {
            category_name : categoryName,
            associated_products : associatedProducts
          },
          oldCategory : gcategory,
          mode,
          auth : getAuth()
        });

      onSave();
      dispatch(closeInputModal());
    } catch (e) {
      if (e.response) {
        //request was made but theres a response status code
        dispatch(
          openAlertModal({
            component: <></>,
            data: e.response.data,
          })
        );
      } else if (e.request) {
        // The request was made but no response was received
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
        // Something happened in setting up the request that triggered an Error
        console.log("Error", e.message);
      }
    }
  };

  return (
    <div>
      <h1 className="text-xl">Category</h1>
      <HelperLabel
        isError={false}
        bg={"bg-teal-50"}
        txtbg={"text-teal-600"}
        msg={"Please make sure the information you provided is correct"}
      />
      <h1 className="text-xs mt-8 mb-4">Information</h1>
      <div>
        <div className="mt-4 relative w-full mr-3 text-green-900 h-full  focus-within:text-green-700 ">
          {/* <div className="absolute inset-y-0 flex items-center pl-2">
            <MdEmail className="w-4 h-4 text-teal-600 cursor-pointer mr-4" />
          </div> */}
          <Input
            className=" rounded-lg border-0 bg-gray-100 transition duration-500 text-gray-600 hover:text-gray-700 focus:text-gray-700"
            placeholder="Category Name"
            aria-label="full"
            required={true}
            value={categoryName}
            onChange={(e) => {
                setCategoryName(e.target.value)
            }}
          />
        </div>
      </div>
      <div >

      </div>
      {categoryName.length === 0 ? (
        <HelperLabel
          isError={true}
          msg={"Please fill up all the input above"}
        />
      ) : (
        ""
      )}
      <Button
        className="rounded-lg w-full mt-8"
        disabled={
          categoryName.length === 0
        }
        onClick={() => save()}
      >
        Save
      </Button>
    </div>
  );
};

export default AddressCreator;
