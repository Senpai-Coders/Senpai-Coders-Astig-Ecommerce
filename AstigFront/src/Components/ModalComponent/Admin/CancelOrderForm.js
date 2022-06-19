import React, { useState } from "react";
import HelperLabel from "../../HelperLabel";

import { Textarea, Label } from "@windmill/react-ui";

const CancelOrderForm = ({ onRemove, entry, record_index }) => {
  const [reason, setReason] = useState("");

  return (
    <div>
      <p className=" text-xl font-medium">Cancel Order</p>
      <div className="my-2">
        <HelperLabel
          bg={"bg-gray-100"}
          txtbg={"text-orange-500"}
          isError={true}
          msg={"Once you cancell this order, you can't see it anymore"}
        />
        <HelperLabel
          bg={"bg-gray-100"}
          txtbg={"text-teal-700"}
          isError={true}
          msg={"User can still see this order as cancelled order"}
        />
      </div>
      <Label className="mt-5">
        <span className="font-medium text-gray-600">
          Please provide a reason for cancellation
        </span>
        <Textarea
          className="mt-4 "
          onChange={(e) => setReason(e.target.value) }
          value={reason}
          rows="12"
          placeholder="Reason for cancellation"
        />
      </Label>
      <div className="mt-4 mb-2">
        {reason.length === 0 && (
          <HelperLabel
            isError={true}
            msg={"Please provide a reason"}
          />
        )}
      </div>
      <button
        disabled={reason.length === 0}
        onClick={() => onRemove(entry, -1, reason, record_index)}
        class="px-4 w-full py-2 font-medium tracking-wide active:bg-red-700 text-white capitalize transition-colors duration-200 transform bg-red-400 hover:bg-red-500 rounded-md focus:outline-none focus:ring  focus:ring-pink-300 focus:ring-opacity-80"
      >
        Proceed
      </button>
    </div>
  );
};

export default CancelOrderForm;
