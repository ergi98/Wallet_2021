import { useEffect } from "react";

// MUI
import { Stack } from "@mui/material";

// Redux
import { setPath } from "../../../features/home/home-slice";
import { useAppDispatch, useAppSelector } from "../../../redux_store/hooks";

// Components
import Home from "../../../components/mobile/home/MobileHome";
import SparkLine from "../../../components/mobile/charts/SparkLine";
import HomeTitle from "../../../components/mobile/home/MobileHomeTitle";
import HomeTopActions from "../../../components/mobile/home/MobileHomeTopActions";

function HomeExpenses() {
	const dispatch = useAppDispatch();
	const currentPath = useAppSelector((state) => state.home.path);
	const chartData = useAppSelector((state) => state.home.expenseChart);

	// In case user navigates by going navigating backwards update the current path
	useEffect(() => {
		currentPath !== "expenses" && dispatch(setPath("expenses"));
	}, [currentPath, dispatch]);

	return (
		<Home>
			<Stack>
				<HomeTopActions />
				<HomeTitle />
				<SparkLine data={chartData} labelKey="date" valueKey="amount" />
			</Stack>
		</Home>
	);
}

export default HomeExpenses;
