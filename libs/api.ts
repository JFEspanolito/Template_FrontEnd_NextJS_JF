import axios from "axios";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";
import configProject from "@/data/configProject";
import configApi from "@/configApi.js"

const apiClient = axios.create({
  baseURL: "/api",
});

apiClient.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    let message = "";

    if (error.response?.status === 401) {
      toast.error("Please login");
      return signIn(undefined, { callbackUrl: configApi.auth.callbackUrl });
    } else if (error.response?.status === 403) {
      message = "Pick a plan to use this feature";
    } else {
      message =
        error?.response?.data?.error || error.message || error.toString();
    }

    error.message =
      typeof message === "string" ? message : JSON.stringify(message);

    console.error(error.message);

    if (error.message) {
      toast.error(error.message);
    } else {
      toast.error("something went wrong...");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
