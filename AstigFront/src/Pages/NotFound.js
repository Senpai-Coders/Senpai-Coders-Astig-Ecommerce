import React from "react";
import { withRouter, useHistory } from 'react-router-dom'
import { Button } from '@windmill/react-ui'
import { getUrl } from "../Helpers/uitils"

const NotFound = (props) => {

  const history = useHistory();

  return (
    <div className="h-screen w-screen bg-gray-100 flex flex-center items-center">
      <div className="m-auto text-center">
        <img width="300px" alt='saly' src="https://cdn.discordapp.com/attachments/955281529481883729/960149662831087626/morty.png"/>
        <p className="text-7xl defText-Col-2">404 </p>
        <p className="mt-2 defText-Col-2 font-medium">Sorry! </p>
        <p className="mt-2 defText-Col-2">Looks Like We Don't Have That Page </p>
        <Button className="mt-7 rounded-xl defBackground hover:bg-green-500" onClick={()=>{
            history.goBack()
        }}>
            Go Back
        </Button>
      </div>
    </div>
  );
};

export default withRouter(NotFound);
