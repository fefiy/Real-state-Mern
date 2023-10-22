import React, { useContext, useEffect } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";


const Layout = () => {
 const {currentUser} = useContext(AuthContext)
console.log(currentUser)

// delete th

 

function checkAndClearUserInfo() {
  // Check if user info exists in local storage
  const userInfoString = localStorage.getItem('userInfo');

  if (userInfoString) {
    const userInfo = currentUser;
    const currentTime = Date.now();
    const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds

    // Calculate the time difference between the current time and the stored timestamp
    const timeDifference = currentTime - userInfo.timestamp;
    // If one day has passed, clear the user info from local storage
    if (timeDifference >= oneDay) {
      localStorage.removeItem('user');
    }
  }
}


  return (
    <>
      <div style={{overflow: "hidden" }}>
        <Header />
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Layout;