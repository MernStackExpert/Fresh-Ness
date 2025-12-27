import { createBrowserRouter } from "react-router";
import HomeLayouts from "../layouts/HomeLayouts";
import HomePage from "../pages/HomePage";

export const route = createBrowserRouter([
  {
    path:"/",
    element: <HomeLayouts/>,
    children: [
      {
        index: true,
        element: <HomePage/>
      }
    ]
  }
])