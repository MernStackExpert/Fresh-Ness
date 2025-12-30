import { createBrowserRouter } from "react-router";
import HomeLayouts from "../layouts/HomeLayouts";
import HomePage from "../pages/HomePage";
import AllGrocerice from "../pages/AllGrocerice";

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
      }
    ]
  }
])