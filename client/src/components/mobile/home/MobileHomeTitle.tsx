// MUI
import { Stack, Typography } from "@mui/material";
import { useAppSelector } from "../../../redux_store/hooks";

// Utilities
import { formatDate, isTodayDate } from "../../../utilities/date-utilities";

// Components
import AmountDisplay from "../../general/AmountDisplay";

interface PropsInterface {
	// date: string;
	label: String;
	amount: number;
	percent: number;
}

function HomeTitle(props: PropsInterface) {
	const currentDate = useAppSelector((state) => state.home.date);
	return (
		<div className="p-3">
			<Stack>
				<div className="pb-3">
					<Typography variant="h6">
						{isTodayDate(currentDate)
							? `Today's ${props.label}`
							: `${props.label}`}
					</Typography>
					<Typography variant="subtitle2">{formatDate(currentDate)}</Typography>
				</div>
				<AmountDisplay amount={props.amount} className="self-center" />
				<AmountDisplay
					amount={props.percent}
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
