import { makeRequest } from "./axios";
import {toast}  from "react-toastify"
import dayjs from "dayjs";

export const getAllProperties = async () => {
    try {
      const response = await makeRequest.get("/residency/allresd", {
        timeout: 10 * 1000,
      });
      if (response.status === 400 || response.status === 500) {
        throw response.data;
      }
      return response.data;
    } catch (error) {
      toast.error("Something went wrong");
      throw error;
    }
  };

  export const getProperty = async (id) => {
    try {
      const response = await makeRequest.get(`/residency/${id}`, {
        timeout: 10 * 1000,
      });
  
      if (response.status === 400 || response.status === 500) {
        throw response.data;
      }
      return response.data;
    } catch (error) {
      toast.error("Something went wrong");
      throw error;
    }
  };

export const createUser = async (data) => {
  console.log("create user")
  try {
    await makeRequest.post(
      `/user/register`, data
    );
  } catch (error) {
    toast.error("Something went wrong, Please try again");
    throw error;
  }
};

export const bookVisit = async (date, propertyId, email, token, privaxios) => {
  console.log(privaxios)
  console.log("book is visited")
  try {
    await privaxios.post(
      `/user/bookVisit/${propertyId}`,
      {
        email,
        id: propertyId,
        date: dayjs(date).format("DD/MM/YYYY"),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    toast.error("Something went wrong, Please try again");
    throw error;
  }
};

export const removeBooking = async (id, email, token, privaxios) => {
  try {
    await privaxios.post(
      `/user/removeBooking/${id}`,
      {
        email,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    toast.error("Something went wrong, Please try again");

    throw error;
  }
};

export const toFav = async (id, email, token, privaxios) => {
  try {
    console.log("tofav api.js", id)
    await privaxios.post(
      `/user/toFav/${id}`,
      {
        email,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (e) {
    throw e;
  }
};


export const getAllFav = async (email, token) => {
  if(!token) return 
  try{

    const res = await makeRequest.post(
      `/user/allFav`,
      {
        email,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
      
    return res.data["favResidenciesID"]

  }catch(e)
  {
    toast.error("Something went wrong while fetching favs");
    throw e
  }
} 


export const getAllBookings = async (email, token) => {
  
  if(!token) return 
  try {
    const res = await makeRequest.post(
      `/user/allBookings`,
      {
        email,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data["bookedVisits"];

    
  } catch (error) {
    toast.error("Something went wrong while fetching bookings");
    throw error
  }
}


export const createResidency = async (data, token, prvaxios) => {
  console.log(createResidency)
  console.log(data)
  try{
    const res = await prvaxios.post(
      `/residency/create`,
      {
        data
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  }catch(error)
  {
    throw error
  }
}