import axios from "../axios/axios";
import useAuth from "./useAuth";
import useTryCatch from "./useTryCatch";

const useRefreshToken = () => {
	const { setAuthState } = useAuth();
	const tryCatch = useTryCatch();

	const refresh = async () => {
		const { data } = await tryCatch(
			axios.get("auth/refresh-token", {
				withCredentials: true,
			})
		);
		if (data && setAuthState) {
			setAuthState((prev) => {
				return {
					...prev,
					isAuthenticated: true,
					token: data.data.token,
				};
			});
			return data.data.token;
		}
	};
	return refresh;
};

export default useRefreshToken;
