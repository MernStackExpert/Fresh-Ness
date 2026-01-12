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
import UserOrderDetails from "../pages/Dashboard/User/UserOrderDetails";
import UserCancelledOrders from "../pages/Dashboard/User/UserCancelledOrders";
import UserDeliveredOrders from "../pages/Dashboard/User/UserDeliveredOrders";
import UnderDevelopment from "../pages/UnderDevelopment";
import MyOrders from "../pages/Dashboard/Admin-Manager-User/MyOrders";
import PrivateRoute from "./Privet/PrivateRoute";
import RoleRoute from "./Privet/RoleRoute";

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
        element: <UnderDevelopment />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: "admin/manage-user",
        element: (
          <RoleRoute allowedRoles={["admin"]}>
            <ManageUsers />
          </RoleRoute>
        ),
      },
      {
        path: "admin/manage-products",
        element: (
          <RoleRoute allowedRoles={["admin"]}>
            <ManageProducts />
          </RoleRoute>
        ),
      },
      {
        path: "admin-manger/add-products",
        element: (
          <RoleRoute allowedRoles={["admin , manager"]}>
            <AddProduct />
          </RoleRoute>
        ),
      },
      {
        path: "admin/product-details/:id",
        element: (
          <RoleRoute allowedRoles={["admin , manager"]}>
            <AdminProductDetails />
          </RoleRoute>
        ),
      },
      {
        path: "admin/update-product/:id",
        element: (
          <RoleRoute allowedRoles={["admin , manager"]}>
            <UpdateProduct />
          </RoleRoute>
        ),
      },
      {
        path: "am/manage-orders",
        element: <RoleRoute allowedRoles={["admin , manager"]}>
          <ManageOrders />
        </RoleRoute>,
      },
      {
        path: "am/shipped-orders",
        element: <RoleRoute allowedRoles={["admin , manager"]}>
          <ShippedOrders />
        </RoleRoute>,
      },
      {
        path: "am/delivered-orders",
        element: <RoleRoute allowedRoles={["admin , manager"]}>
          <DeliveredOrders />
        </RoleRoute>,
      },
      {
        path: "am/cancelled-orders",
        element: <RoleRoute allowedRoles={["admin , manager"]}>
          <CancelledOrders />
        </RoleRoute>,
      },
      {
        path: "admin/order-details/:id",
        element: <RoleRoute allowedRoles={["admin , manager"]}>
          <OrderDetails />
        </RoleRoute>,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "my-orders",
        element: <MyOrders />,
      },
      {
        path: "order-detailse/:id",
        element: <UserOrderDetails />,
      },
      {
        path: "cancelled-orders",
        element: <UserCancelledOrders />,
      },
      {
        path: "delivered-orders",
        element: <UserDeliveredOrders />,
      },
    ],
  },
]);
