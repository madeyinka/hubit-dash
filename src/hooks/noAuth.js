import axios from "axios";

const baseUrl = process.env.REACT_APP_ENV == 'development' ? 
                process.env.REACT_APP_DEV_ENDPOINT : process.env.REACT_APP_PROD_ENDPOINT

export default axios.create({
    baseURL: baseUrl
})

export const axiosPrivate = axios.create({
    baseURL: baseUrl,
    headers: {'Content-Type': 'application/json'},
    withCredentials: true
})