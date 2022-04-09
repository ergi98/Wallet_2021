// Axios
import axios from "axios";

let headers: any = {};

let token = localStorage.getItem("token");
let refresh = localStorage.getItem("refresh");

token && (headers.Authorization = `Bearer ${JSON.parse(token)}`);
refresh && (headers.Refresh = `Bearer ${JSON.parse(refresh)}`);

const AxiosInstance = axios.create({
	baseURL: process.env.REACT_APP_PROXY,
	headers,
});

AxiosInstance.interceptors.response.use(successCallback, errorCallback);

function successCallback(success: any) {
	console.dir(success);
  return success;
}

function errorCallback(error: any) {
	if (error.response.status === 500) {
		localStorage.clear();
		clearAxiosInstance();
	} else throw error;
}

function setTokenInterceptor(token: string, refreshToken: string | undefined) {
	AxiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
	refreshToken &&
		(AxiosInstance.defaults.headers.common[
			"Refresh"
		] = `Bearer ${refreshToken}`);
}

function clearAxiosInstance() {
	delete AxiosInstance.defaults.headers.common["Authorization"];
	delete AxiosInstance.defaults.headers.common["Refresh"];
}

export { AxiosInstance, setTokenInterceptor, clearAxiosInstance };
