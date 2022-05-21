import { useLocation } from "react-router-dom";
import axios from "../axios/axios";
import { refreshToken } from "../features/auth/auth-slice";
import { useAppDispatch } from "../redux_store/hooks";

const useRefreshToken = () => {
	const dispatch = useAppDispatch();

	async function refresh() {
		try {
			const result = await dispatch(refreshToken(axios)).unwrap();
			return result.token;
		} catch (err) {
			console.error(err);
		}
	}
	return refresh;
};

export default useRefreshToken;
