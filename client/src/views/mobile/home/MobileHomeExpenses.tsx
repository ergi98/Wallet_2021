// MUI
import { Stack } from "@mui/material";

// Components
import Home from "../../../components/mobile/home/MobileHome";
import SparkLine from "../../../components/mobile/charts/SparkLine";
import HomeTitle from "../../../components/mobile/home/MobileHomeTitle";
import HomeTopActions from "../../../components/mobile/home/MobileHomeTopActions";

function HomeExpenses() {
	return (
		<Home>
			<Stack>
				<HomeTopActions />
				<HomeTitle label="Expenses" amount={18023.23} percent={2.34} />
				<SparkLine data={[]} />
			</Stack>
		</Home>
	);
}

export default HomeExpenses;
