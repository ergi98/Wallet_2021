// MUI
import { Stack, Typography } from "@mui/material";

// Utilities
import { formatDate, isTodayDate } from "../../../utilities/date-utilities";

// Components
import AmountDisplay from "../../general/AmountDisplay";

interface PropsInterface {
	date: string;
	label: String;
	amount: number;
	percent: number;
}

function HomeTitle(props: PropsInterface) {
	return (
		<div className="p-3">
			<Stack>
				<div className="pb-3">
					<Typography variant="h6">
						{isTodayDate(props.date)
							? `Today's ${props.label}`
							: `${props.label}`}
					</Typography>
					<Typography variant="subtitle2">{formatDate(props.date)}</Typography>
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
