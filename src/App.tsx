import {
  RouterProvider,
  createBrowserRouter,
  useNavigate,
} from "react-router-dom";
import React, { ReactNode, useEffect } from "react";
import { Admin } from "./pages/admin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Admin />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
