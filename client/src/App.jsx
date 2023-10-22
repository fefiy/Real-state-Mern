import React, { useContext } from "react";
import { QueryClient, QueryClientProvider} from "react-query";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import {toast} from "react-toastify"
import Website from "./pages/Website";
import Properties from "./pages/properties/Properties";
import Property from "./pages/Property/Property";
import Layout from "./components/Layout/Layout";
import Login from "./pages/login/Login";
import EmailVerify from "./components/verifyEemail/VerifyEmail";
import Bookings from "./components/Bookings/Bookings";
import Favourites from "./components/Favorites/Favourites";
import { AuthContext } from "./context/AuthContext";
const App = () => {
  const { currentUser } = useContext(AuthContext);
  const queryClient = new QueryClient();
  const ProtectedRoue = ({ children }) => {
    if (currentUser === null) {
      return(
        <>
        <Navigate to="/login" />
        {
        toast.error("You have to be login!")
        }
        </>
      )
    }
    return children;
  };
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Website />,
        },
        {
          path: "/properties",
          element: <Properties />,
        },
        {
          path: "/properties/:id",
          element: <Property />,
        },
        {
          path: "/booking",
          element: (
            <ProtectedRoue>
              <Bookings />
            </ProtectedRoue>
          ),
        },
        {
          path: "/favourites",
          element: (
            <ProtectedRoue>
              <Favourites />
            </ProtectedRoue>
          ),
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/users/:id/verify/:token",
      element: <EmailVerify />,
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

export default App;
