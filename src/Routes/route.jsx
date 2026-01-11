import { createBrowserRouter } from "react-router";
import HomeLayouts from "../layouts/HomeLayouts";
import HomePage from "../pages/HomePage";
import AllGrocerice from "../pages/AllGrocerice";
import Contact from "../pages/Contact";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import OrderSuccess from "../pages/OrderSuccess";
import Registration from "../pages/Registration";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import AboutSection from "../pages/AboutSection";
import Services from "../pages/Services";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardHome from "../pages/Dashboard/DashboardHome";
import ManageUsers from "../pages/Dashboard/Admin/ManageUser";
import ManageProducts from "../pages/Dashboard/Admin/ManageProducts";
import AdminProductDetails from "../pages/Dashboard/Admin/AdminProductDetails";
import AddProduct from "../pages/Dashboard/Admin-manger/AddProduct";
import UpdateProduct from "../pages/Dashboard/Admin-manger/UpdateProduct";
import OrderDetails from "../pages/Dashboard/Admin-manger/OrderDetails";
import ManageOrders from "../pages/Dashboard/Admin-manger/Orders/ManageOrders";
import ShippedOrders from "../pages/Dashboard/Admin-manger/Orders/ShippedOrders";
import DeliveredOrders from "../pages/Dashboard/Admin-manger/Orders/DeliveredOrders";
import CancelledOrders from "../pages/Dashboard/Admin-manger/Orders/CancelledOrders";
import MyOrders from "../pages/Dashboard/User/MyOrders";
import UserOrderDetails from "../pages/Dashboard/User/UserOrderDetails";
import UserCancelledOrders from "../pages/Dashboard/User/UserCancelledOrders";
import UserDeliveredOrders from "../pages/Dashboard/User/UserDeliveredOrders";
import UnderDevelopment from "../pages/UnderDevelopment";

export const route = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayouts />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/all-grocerice",
        element: <AllGrocerice />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/detailes/:id",
        element: <ProductDetails />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/checkout",
        element: <Checkout />,
      },
      {
        path: "/order-success",
        element: <OrderSuccess />,
      },
      {
        path: "/registration",
        element: <Registration />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/about",
        element: <AboutSection />,
      },
      {
        path: "/services",
        element: <Services />,
      },
      {
        path: "/current-work",
        element: <UnderDevelopment/>,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: "admin/manage-user",
        element: <ManageUsers />,
      },
      {
        path: "admin/manage-products",
        element: <ManageProducts />,
      },
      {
        path: "admin-manger/add-products",
        element: <AddProduct />,
      },
      {
        path: "admin/product-details/:id",
        element: <AdminProductDetails />,
      },
      {
        path: "admin/update-product/:id",
        element: <UpdateProduct />,
      },
      {
        path: "am/manage-orders",
        element: <ManageOrders />,
      },
      {
        path: "am/shipped-orders",
        element: <ShippedOrders />,
      },
      {
        path: "am/delivered-orders",
        element: <DeliveredOrders />,
      },
      {
        path: "am/cancelled-orders",
        element: <CancelledOrders />,
      },
      {
        path: "admin/order-details/:id",
        element: <OrderDetails />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "my-orders",
        element: <MyOrders/>,
      },
      {
        path: "order-detailse/:id",
        element: <UserOrderDetails/>,
      },
      {
        path: "cancelled-orders",
        element: <UserCancelledOrders/>,
      },
      {
        path: "delivered-orders",
        element: <UserDeliveredOrders/>,
      },
    ],
  },
]);
