import React, { useEffect, useState } from "react";
import { Switch, Route, withRouter, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import adminRoutes from "../../Routes/AdminRoute";

import { openAlertModal } from "../../Features/uiSlice";
import API from "../../Helpers/api";
import { getAuth } from "../../Helpers/uitils"

import NotFound from "../NotFound";
import Insights from "./Insights";
import Products from "./Products";
import AdminHeader from "../../Components/AdminHeader";
import Categories from "../../Pages/Admin/Categories";
import Chat from "../../Pages/Admin/Chat";
import Couriers from "../../Pages/Admin/Couriers";
import DeliveredOrders from "../../Pages/Admin/DeliveredOrders";
import OrdersInProgress from "../../Pages/Admin/OrderInProgress";
import PendingOrders from "../../Pages/Admin/PendingOrders";
import Admins from "../../Pages/Admin/Admins";

const AdminContainer = (props) => {
  const { history } = props;

  const dispatch = useDispatch();
  const adminData = useSelector((state) => state.adminData);
  const [toggleSide, setToggleSide] = useState(false)

  let location = useLocation();

  const amISignedIn = async () => {
    try {
      //dispatch save logindata
      let savedAdmin = JSON.parse(localStorage.getItem("adminData"));
      if (!savedAdmin) {
        history.push("/auth/admin_signin");
        return;
      }
      const response = await API.post(`/admin/mydetails/${savedAdmin._id}`, { auth : getAuth() });
    } catch (error) {
      if (error.response) {
        //request was made but theres a response status code
        dispatch(
          openAlertModal({
            component: <></>,
            data: error.response.data,
          })
        );
      }
      history.push("/auth/admin_signin");
    }
  };

  useEffect(() => {
    amISignedIn();
  });

  useEffect(() => {}, [location]);

  return (
    <div onClick={(e)=>{
        e.stopPropagation()
        setToggleSide(false)
    }} className={`flex relative h-screen bg-gray-50 dark:bg-gray-900 `}>
      <aside className="hidden z-30 flex-shrink-0 px-4 w-64 overflow-y-auto bg-white dark:bg-gray-800 lg:block">
        <div className="flex items-center my-6">
        <a
            className="font-inter defTextCOlorBlack ml-6 text-sm md:text-lg text-gray-800 dark:text-gray-200"
            href="/admin"
          >
            Astig03
          </a>

          <Link
            to="/admin"
            className="ml-2 font-inter defTextCOlorBlack font-extrabold text-xl "
          >
            ADMIN
          </Link>
        </div>
        <div className="overflow-y-auto mt-8 overflow-x-hidden flex-grow">
          {adminRoutes.map((routeGroup, idx) => (
            <ul key={idx} className="flex flex-col py-2 mb-3">
              <li className="px-5">
                <div className="flex flex-row items-center h-8">
                  <div className="text-sm font-medium tracking-wide text-gray-500">
                    {routeGroup.name}
                  </div>
                </div>
              </li>
              {routeGroup.routes.map((routes, idx) => (
                <li key={idx}>
                  <Link
                    to={routes.path}
                    className={`filter transition overflow-x-hidden duration-200 ease-in-out motion-reduce:transition-none motion-reduce:transform-none relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-500 border-l-4 border-transparent hover:border-gray-700 pr-6 hover:text-gray-700 ${
                      location.pathname === routes.path &&
                      "bg-gray-50 italic shadow-inner rounded-lg border-gray-500 font-medium text-gray-600"
                    } `}
                  >
                    <routes.icon className=" ml-4" />
                    <span className="ml-2 text-sm tracking-wide truncate">
                      {routes.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </aside>
      <aside className={`${toggleSide? 'left-0 z-10' : '-left-80'} duration-500 absolute lg:hidden z-30 flex-shrink-0 px-4 w-64 overflow-y-auto bg-white dark:bg-gray-800`}>
        <div className="flex items-center my-6">
          <Link
            className=" MoonTime defTextCOlorGreen lg:block ml-6 text-2xl font-bold text-gray-800 dark:text-gray-200"
            to="/admin"
          >
            Astig 03
          </Link>
          <Link
            to="/admin"
            className="ml-4 font-extrabold text-xl text-gray-600"
          >
            ADMIN
          </Link>
        </div>
        <div className="overflow-y-auto mt-8 overflow-x-hidden flex-grow">
          {adminRoutes.map((routeGroup, idx) => (
            <ul key={idx} className="flex flex-col py-2 mb-3">
              <li className="px-5">
                <div className="flex flex-row items-center h-8">
                  <div className="text-sm font-medium tracking-wide text-gray-500">
                    {routeGroup.name}
                  </div>
                </div>
              </li>
              {routeGroup.routes.map((routes, idx) => (
                <li key={idx}>
                  <Link
                    to={routes.path}
                    className={`filter transition overflow-x-hidden duration-200 ease-in-out motion-reduce:transition-none motion-reduce:transform-none relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-500 border-l-4 border-transparent hover:border-gray-700 pr-6 hover:text-gray-700 ${
                      location.pathname === routes.path &&
                      "bg-gray-50 italic shadow-inner rounded-lg border-gray-500 font-medium text-gray-600"
                    } `}
                  >
                    <routes.icon className=" ml-4" />
                    <span className="ml-2 text-sm tracking-wide truncate">
                      {routes.name}
                    </span>
                  </Link> 
                </li>
              ))}
            </ul>
          ))}
        </div>
      </aside>
      <div className="flex flex-col flex-1 w-full">
        <AdminHeader curVal={toggleSide} toggleSide={setToggleSide} adminData={adminData} />
        <main className="h-full overflow-y-auto  scrollbar-thumb- scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
          <div className="container grid mx-auto">
            <Switch>
              <Route exact path="/admin" component={Insights} />
              <Route exact path="/admin/insights" component={Insights} />
              <Route exact path="/admin/products" component={Products} />
              <Route exact path="/admin/categories" component={Categories} />
              <Route exact path="/admin/pending_orders" component={PendingOrders} />
              <Route exact path="/admin/orders_in_progress" component={OrdersInProgress} />
              <Route exact path="/admin/delivered_orders" component={DeliveredOrders} />
              <Route exact path="/admin/chat" component={Chat} />
              <Route exact path="/admin/couriers" component={Couriers} />
              <Route exact path="/admin/admins" component={Admins} />
              <Route path="*" component={NotFound} />
            </Switch>
          </div>
        </main>
      </div>
    </div>
  );
};

export default withRouter(AdminContainer);
