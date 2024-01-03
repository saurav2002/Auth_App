// import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Home/Home";
import Parent from "./Parent";
// import SignIn from "./SignIn/SignIn";
import Login from "./Login/Login";
import Profile from "./Profile/Profile";
import Signup from "./Signup/Signup";
import Private from "./private/Private";
import Forget from "./forget/Forget";
// import Signup from "./SignIn/Signup";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Parent />,
      children: [
        {
          path: "/signup",
          element: <Signup />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/home",
          element: <Home />,
        },

        {
          element: <Private />,
          children: [
            {
              path: "/profile",
              element: <Profile />,
            },
          ],
        },
        {
          path: "/forget",
          element: <Forget />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router}></RouterProvider>;
}
