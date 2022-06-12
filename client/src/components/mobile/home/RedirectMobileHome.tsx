import React, { useEffect } from "react";

// Navigation
import { useNavigate } from "react-router-dom";

// ReduxRedirectMobileHome
import { useAppSelector } from "../../../redux_store/hooks";

function RedirectMobileHome() {
	const navigate = useNavigate();
	const previousRoute = useAppSelector((state) => state.home.path);
	useEffect(() => {
		navigate(`/home/${previousRoute}`);
	}, [previousRoute, navigate]);
	return null;
}

export default RedirectMobileHome;
