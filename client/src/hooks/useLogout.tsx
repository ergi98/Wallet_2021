// Hooks
import useAuth from "./useAuth";
import useTryCatch from "./useTryCatch";
import useAxiosPrivate from "./useAxiosPrivate";

// Navigation
import { useNavigate } from "react-router-dom";

const useLogout = () => {
	const navigate = useNavigate();
	const tryCatch = useTryCatch();
	const axios = useAxiosPrivate();
	const { setAuthState } = useAuth();

	const logout = async () => {
		let { data } = await tryCatch(axios.post("/auth/log-out"));
		if (data) {
			// Handle logout
			setAuthState &&
				setAuthState({
					token: null,
					isAuthenticated: false,
				});
			navigate("/", { replace: true });
		}
	};

	return logout;
};

export default useLogout;
