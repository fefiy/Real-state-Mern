import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { makeRequest } from "../utils/axios";
export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [err, SetErr] = useState(null)
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
 
  const login = async(input) => {
    try{
        const res =   await makeRequest.post("/user/login", input)
        setCurrentUser(res.data)
    }catch(err){
       SetErr(err.response.data)
       console.log("auth", err)
    }
    
  };

  useEffect(() => {
    if(currentUser !== null){
        currentUser.timestamp = Date.now()
    }
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  function checkAndClearUserInfo() {
    // check if the local storaget 
    const userInfoString = localStorage.getItem('userInfo');
  
    if (userInfoString) {
      const userInfo = JSON.parse(userInfoString);
      const currentTime = Date.now();
      const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
  
      // Calculate the time difference between the current time and the stored timestamp
      const timeDifference = currentTime - userInfo.timestamp;
  
      // If one day has passed, clear the user info from local storage
      if (timeDifference >= oneDay) {
        localStorage.removeItem('userInfo');
      }
    }
  }
  
  // Example usage
  
  // Call the function to check and clear user info after one day
  
  return (
    <AuthContext.Provider value={{ currentUser, login, err,setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};