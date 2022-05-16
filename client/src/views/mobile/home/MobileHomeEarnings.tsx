// MUI
import { Stack } from "@mui/material";

// Navigate
import { useNavigate } from "react-router-dom";

// Redux
import { setDate, setPath } from "../../../features/home/home-slice";
import { useAppDispatch, useAppSelector } from "../../../redux_store/hooks";

// Components
import Home from "../../../components/mobile/home/MobileHome";
import HomeTitle from "../../../components/mobile/home/MobileHomeTitle";
import HomeTopActions from "../../../components/mobile/home/MobileHomeTopActions";

function HomeEarnings() {
	return (
		<Home>
			<Stack>
				<HomeTopActions />
				<HomeTitle label="Earnings" amount={18023.23} percent={2.34} />
			</Stack>
		</Home>
	);
}

export default HomeEarnings;
