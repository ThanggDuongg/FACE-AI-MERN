import axiosClient from "./axiosClient";

const path = "/image";

const imageApi = {
  detectOneFace: (params) => {
    const url = path + "/detect-one-face";
    return axiosClient.post(url, params);
  },
};

export default imageApi;
