// MUI
import { Stack, Typography } from "@mui/material";

// Redux
import { useAppSelector } from "../../../redux_store/hooks";
import { RootState } from "../../../redux_store/store";

// Utilities
import { formatDate, isTodayDate } from "../../../utilities/date-utilities";

// Components
import AmountDisplay from "../../general/AmountDisplay";

interface AmountInterface {
	amount: number;
	percent: number;
}

function HomeTitle() {
	const path = useAppSelector((state) => state.home.path);
	const date = useAppSelector((state) => state.home.date);
	const todayData = useAppSelector((state) => getAmounts(state));
	const loading = useAppSelector((state) => state.home.loading);

	function getAmounts(state: RootState): AmountInterface {
		switch (path) {
			case "earnings":
				return state.home.today.earning;
			case "expenses":
				return state.home.today.expense;
			default:
				return { amount: 0, percent: 0 };
		}
	}

	return (
		<div className="p-3">
			<Stack>
				<div className="pb-3">
					<Typography className=" capitalize" variant="h6">
						{isTodayDate(date) ? `Today's ${path}` : `${path}`}
					</Typography>
					<Typography variant="subtitle2">{formatDate(date)}</Typography>
				</div>
				<AmountDisplay
					amount={todayData.amount}
					className="self-center"
					loading={loading}
				/>
				<AmountDisplay
					amount={todayData.percent}
					loading={loading}
					suffix={"%"}
					wholeClass="text-sm"
					decimalClass="text-xs"
					className="self-center text-neutral-100"
				/>
			</Stack>
		</div>
	);
}

export default HomeTitle;
