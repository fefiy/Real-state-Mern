import { privateAxios } from "../utils/axios";
import { useContext, useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import { AuthContext } from "../context/AuthContext";


const useAxiosPrivate = () => {
    console.log("usePrivate axios")
   const {currentUser} = useContext(AuthContext)
    const refresh = useRefreshToken();
    useEffect(() => {

        const requestIntercept = privateAxios.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${currentUser?.token}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = privateAxios.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const accessToken = await refresh();
                    console.log("refresh token and ", accessToken)
                    prevRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                    return privateAxios(prevRequest);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            privateAxios.interceptors.request.eject(requestIntercept);
            privateAxios.interceptors.response.eject(responseIntercept);
        }
    }, [refresh])

    return privateAxios;
}

export default useAxiosPrivate;