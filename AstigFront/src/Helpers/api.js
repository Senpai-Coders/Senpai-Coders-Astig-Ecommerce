import axios from "axios";
require("dotenv").config();

export const baseURL = process.env.REACT_APP_SERVERURL

export let API = axios.create({
    baseURL : baseURL,
    withCredentials : true
})

API.defaults.withCredentials = true

export default API;