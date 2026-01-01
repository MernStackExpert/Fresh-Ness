import { createBrowserRouter } from "react-router";
import HomeLayouts from "../layouts/HomeLayouts";
import HomePage from "../pages/HomePage";
import AllGrocerice from "../pages/AllGrocerice";
import Contact from "../pages/Contact";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import OrderSuccess from "../pages/OrderSuccess";


export const route = createBrowserRouter([
  {
    path:"/",
    element: <HomeLayouts/>,
    children: [
      {
        index: true,
        element: <HomePage/>
      },
      {
        path: "/all-grocerice",
        element: <AllGrocerice/>
      },
      {
        path: "/contact",
        element: <Contact/>
      },
      {
        path: "/detailes/:id",
        element: <ProductDetails/>
      },
      {
        path: "/cart",
        element: <Cart/>
      },
      {
        path: "/checkout",
        element: <Checkout/>
      },
      {
        path: "/order-success",
        element: <OrderSuccess/>
      }
    ]
  }
])