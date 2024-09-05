import "./App.css";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Login from "./Page/Login";
import Signup from "./Page/Signup";
import AuthGuard from "./AuthGuard";
import CompanyDataTable from "./Components/CompanyDataTable";
import Navbar from "./Components/Navbar/Navbar";
import ForgotPassword from "./Page/ForgotPassword";

function App() {
  const Layout = () => {
    return (
      <div className="main">
        <Navbar />
        <div className="container">
          <Outlet />
        </div>
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <AuthGuard>
          <Layout />
        </AuthGuard>
      ),
      children: [
        {
          path: "/company-table",
          element: <CompanyDataTable />,
        },
      ],
    },
    {
      path: "/login",
      element: (
        <AuthGuard>
          <Login />
        </AuthGuard>
      ),
    },
    {
      path: "/signup",
      element: (
        <AuthGuard>
          <Signup />
        </AuthGuard>
      ),
    },
    {
      path: "/forgotPassword/:token",
      element: <ForgotPassword />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
