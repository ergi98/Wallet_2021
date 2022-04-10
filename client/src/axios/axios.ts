// Axios
import axios from "axios";

export default axios.create({
	baseURL: process.env.REACT_APP_PROXY,
});

export const axiosPrivate = axios.create({
	withCredentials: true,
	baseURL: process.env.REACT_APP_PROXY,
	headers: {
		"Content-Type": "application/json",
	},
});
