import { useEffect } from "react";

// Axios
import { axiosPrivate } from "../axios/axios";

// RFDC
import rfdc from "rfdc";

// Hooks
import useRefreshToken from "./useRefreshToken";
import { useAppSelector } from "../redux_store/hooks";

const useAxiosPrivate = () => {
	const clone = rfdc();
	const refreshToken = useRefreshToken();

	const token = useAppSelector((state) => state.auth.token);

	useEffect(() => {
		const requestIntercept = axiosPrivate.interceptors.request.use(
			(config: any) => {
				if (!config.headers["Authorization"]) {
					config.headers["Authorization"] = `Bearer ${token}`;
				}
				return config;
			},
			(error) => Promise.reject(error)
		);

		const responseIntercept = axiosPrivate.interceptors.response.use(
			(response) => response,
			async (error) => {
				const prevRequest = clone(error?.config);
				if (error?.response?.status === 403 && !prevRequest?.sent) {
					prevRequest.sent = true;
					const newAccessToken = await refreshToken();
					prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
					return axiosPrivate(prevRequest);
				}
				return Promise.reject(error);
			}
		);

		return () => {
			axiosPrivate.interceptors.request.eject(requestIntercept);
			axiosPrivate.interceptors.response.eject(responseIntercept);
		};
	}, [token, refreshToken]);

	return axiosPrivate;
};

export default useAxiosPrivate;
