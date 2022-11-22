import axiosClient from "./axiosClient";

const path = "/user";

const userApi = {
  register: (params) => {
    const url = path + "/register";
    return axiosClient.post(url, params);
  },
  login: (params) => {
    const url = path + "/login";
    return axiosClient.post(url, params);
  },
  resetPassword: (params) => {
    const url = path + "/reset-password";
    return axiosClient.post(url, params);
  },
  refreshToken: (params) => {
    const url = path + "/refresh-token";
    return axiosClient.post(url, params);
  }
};

export default userApi;
