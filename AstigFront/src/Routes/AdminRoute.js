/**
 * ⚠ These are used just to render the Sidebar!
 * You can include any link here, local or external.
 *
 * If you're looking to actual Router routes, go to
 * `routes/index.js`
 */
import { BiStats } from "react-icons/bi";
import { RiTruckFill } from "react-icons/ri";
import {
  MdOutlineShoppingBag,
  MdPendingActions,
  MdCategory,
} from "react-icons/md";
import { FaTruckLoading } from "react-icons/fa";
import { BsShieldShaded, BsFillChatFill } from "react-icons/bs";

const adminRoutes = [
  {
    name: "Dashboard",
    routes: [
      {
        name: "Insights",
        path: "/admin",
        icon: BiStats,
      },
    ],
  },
  {
    name: "Product & Management",
    routes: [
      {
        name: "Couriers",
        path: "/admin/couriers",
        icon: RiTruckFill,
      },
      {
        name: "Categories",
        path: "/admin/categories",
        icon: MdCategory,
      },
      {
        name: "Products",
        path: "/admin/products",
        icon: MdOutlineShoppingBag,
      },
      {
        name: "Chat",
        path: "/admin/chat",
        icon: BsFillChatFill,
      },
    ],
  },
  {
    name: "Transactions",
    routes: [
      {
        name: "Pending Orders",
        path: "/admin/pending_orders",
        icon: MdPendingActions,
      },
      {
        name: "Orders In Progress",
        path: "/admin/orders_in_progress",
        icon: FaTruckLoading,
      },
      {
        name: "Delivered Orders",
        path: "/admin/delivered_orders",
        icon: RiTruckFill,
      },
    ],
  },
  {
    name: "Account Management",
    routes: [
      {
        name: "Admins",
        path: "/admin/admins",
        icon: BsShieldShaded,
      },
      //   {
      //     name : "Users",
      //     path : "/admin/users",
      //     icon : FaUserFriends,
      //   }
    ],
  },
];

export default adminRoutes;
