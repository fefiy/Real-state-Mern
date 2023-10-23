import { useContext } from "react";
import { makeRequest } from "../utils/axios";
import { AuthContext } from "../context/AuthContext";


const useRefreshToken = () => {
  const {setCurrentUser ,currentUser} = useContext(AuthContext)
  const refresh = async () => {
    try {
      const response = await makeRequest.get("/refresh?email=" + currentUser?.user?.email);
    //   makeRequest.get("/comments?postId=" + postId)
      console.log("response")   
      if (response?.data) {
        console.log("refreshToken", response)
        setCurrentUser((prev)=> (
            {...prev, token:response.data.accessToken}
        ))
        console.log("refrshToken from userrefreshtoken", response)
        localStorage.setItem("user", JSON.stringify(currentUser))
        return response.data.accessToken
      }
    } catch (err) {
      console.log(err);
    }
  };
  return refresh;
};

export default useRefreshToken;
