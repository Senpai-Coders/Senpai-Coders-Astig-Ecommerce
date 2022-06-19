import React from "react";
import { Redirect, Route , withRouter } from "react-router-dom";


const ProtectedRoute = ({ component: Component, ...rest }) => {
const userData = localStorage.getItem("userData")

  //   if ( !_cur_user.hasUser ) {
  //     return <Redirect to="/auth/signin"></Redirect>;
  //   }


  return (
    <Route
      {...rest}
      render={(props) => {
        if (userData) {
          return <Component {...props} />;
        } else {
          return <Redirect to="/auth/signin" />;
        }
      }}
    />
  );
};

export default withRouter(ProtectedRoute)