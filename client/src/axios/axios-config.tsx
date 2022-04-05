// Axios
import axios from "axios";

const AxiosInstance = axios.create();

// eslint-disable-next-line no-undef
AxiosInstance.defaults.baseURL = process.env.REACT_APP_PROXY;

AxiosInstance.interceptors.response.use(successCallback, errorCallback);

function successCallback(success: any) {
	console.dir(success);
	// If success response includes token => setTokenInterceptor
}

function errorCallback(error: any) {
	console.dir(error);
	// If error code === 500 logout (local)
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
