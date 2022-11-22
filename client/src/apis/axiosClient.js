import axios from "axios";
import queryString from "query-string";
import Cookies from "universal-cookie";
import { parse, stringify } from 'qs';

const current = new Date();
const nextYear = new Date();
nextYear.setFullYear(current.getFullYear() + 1);

// Set up default config for http requests here
// Please have a look at here `https://github.com/axios/axios#request-config` for the full list of configs
const cookies = new Cookies();
const axiosClient = axios.create({
  //config credentials
  // withCredentials: true,
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  //use queryString handle parameter
  paramsSerializer: {
    encode: parse,
    serialize: stringify,
  },
  // paramsSerializer: params => queryString.stringify(params),
});

// axiosClient.defaults.withCredentials = true;

axiosClient.interceptors.request.use(async (config) => {
  // Handle token here ...
  // var authToken = localStorage.getItem("authToken") ? JSON.parse(localStorage.getItem("authToken")) : null;
  var authToken = cookies.get("authToken") ? cookies.get("authToken") : null;
  if (
    config.url !== process.env.REACT_APP_API_STOREIMAGE &&
    authToken !== null
  ) {
    var accessToken = authToken.accessToken;
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }

  return config;
});

// let refreshing_token = null;

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // const config = error.config;
    // if (error.response && error.response.status === 401 && !config._retry) {
    //   config._retry = true;
    //   try {
    //     var authToken = cookies.get("authToken")
    //       ? cookies.get("authToken")
    //       : null;
    //     // refreshing_token = refreshing_token ? refreshing_token : authApi.refreshToken(
    //     //    authToken.refreshToken,
    //     // );
    //     // store
    //     //   .dispatch(refreshToken(authToken.refreshToken))
    //     //   .unwrap()
    //     //   .then((res) => {
    //     //     console.log(res);
    //     //     cookies.set("authToken", JSON.stringify(res.authToken), {
    //     //       path: "/",
    //     //       expires: nextYear,
    //     //     });
    //     //     return axiosClient(config);
    //     //   })
    //     //   .catch((status) => {
    //     //     if (status === 401) {
    //     //       store.dispatch(logout());
    //     //     }
    //     //   });

    //     // let res = await refreshing_token;
    //     // refreshing_token = null;
    //     // if (authToken_dispatch.authToken) {
    //     //    // localStorage.setItem("authToken", JSON.stringify(res.data.data));

    //     // } else {
    //     //    // if unauthorize (401), refresh token is expired => logout
    //     //    if () {
    //     //       const logout = await authApi.logout();
    //     //    }
    //     // }
    //   } catch (error) {
    //     return Promise.reject(error);
    //   }
    // }
    return Promise.reject(error);
  },
);

export default axiosClient;
