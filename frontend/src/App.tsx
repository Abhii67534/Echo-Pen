
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Signin } from "./pages/Signin";
import { Blog } from "./pages/Blog";
import { Signup } from "./pages/Signup";
import { Home } from "./pages/Home";
import { BlogPost } from "./pages/BlogPost";
import "./index.css";

// Define the router using createBrowserRouter
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/signin",
    element: <Signin />,
  },
  {
    path: "/blog",
    element: <Blog />,
  },
  {
    path: "/blog-post",
    element: <BlogPost />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
