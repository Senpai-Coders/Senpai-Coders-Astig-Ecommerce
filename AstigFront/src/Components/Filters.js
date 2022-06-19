import React from 'react'

import { Button } from '@windmill/react-ui'

function Filters() {
    return (
        <div>
            <div className="flex justify-between ">
                <p className="text-xl font-semibold text-black"> 
                    Filters
                </p>
                <Button className=" px-2 py-1 rounded-md ">
                    Apply
                </Button>
            </div>
            <div className="my-4">
                <p className="text-lg text-black">
                    Availability
                </p>
            </div>
            <div>
                <p className="text-lg text-black">
                    Sort By Price
                </p>
            </div>
        </div>
    )
}

export default Filters
