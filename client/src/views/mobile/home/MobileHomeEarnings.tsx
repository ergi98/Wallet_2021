import { useEffect } from "react";

// MUI
import { Stack } from "@mui/material";

// Redux
import { setPath } from "../../../features/home/home-slice";
import { useAppDispatch, useAppSelector } from "../../../redux_store/hooks";

// Components
import Home from "../../../components/mobile/home/MobileHome";
import HomeTitle from "../../../components/mobile/home/MobileHomeTitle";
import HomeTopActions from "../../../components/mobile/home/MobileHomeTopActions";

function HomeEarnings() {
	const dispatch = useAppDispatch();
	const currentPath = useAppSelector((state) => state.home.path);

	// In case user navigates by going navigating backwards update the current path
	useEffect(() => {
		currentPath !== "earnings" && dispatch(setPath("earnings"));
	}, [currentPath, dispatch]);

	return (
		<Home>
			<Stack>
				<HomeTopActions />
				<HomeTitle />
			</Stack>
		</Home>
	);
}

export default HomeEarnings;
