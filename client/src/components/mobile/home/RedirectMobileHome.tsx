import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../redux_store/hooks";

function RedirectMobileHome() {
	const navigate = useNavigate();
	const previousRoute = useAppSelector((state) => state.home.path);
	useEffect(() => {
		navigate(`/home/${previousRoute}`);
	}, []);
	return <div></div>;
}

export default RedirectMobileHome;
