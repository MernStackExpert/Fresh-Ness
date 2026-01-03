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
import ManageOrders from "../pages/Dashboard/Admin-manger/ManageOrders";
import OrderDetails from "../pages/Dashboard/Admin-manger/OrderDetails";

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
        path: "manage-orders",
        element: <ManageOrders />,
      },
      {
        path: "admin/order-details/:id",
        element: <OrderDetails />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
]);
