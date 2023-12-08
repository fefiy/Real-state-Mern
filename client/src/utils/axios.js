import axios from "axios"


export  const makeRequest = axios.create({
    baseURL:"https://real-state-nodejs.onrender.com/api",
    headers:true
})


export  const privateAxios = axios.create({
    baseURL:"https://real-state-nodejs.onrender.com/api",
    headers:true
})