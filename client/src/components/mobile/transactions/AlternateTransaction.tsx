import { useState } from "react";

// Interfaces
// import { TransactionInterface } from "../../../interfaces/transactions-interface";

// MUI
import { Stack, Typography } from "@mui/material";

// Utilities
import { getTimeFromDateString } from "../../../utilities/date-utilities";

// Components
import AmountDisplay from "../../general/AmountDisplay";

interface PropsInterface {
	onClick: (a: boolean, b: any | null) => void;
	transaction: any;
}

function AlternateTransaction(props: PropsInterface) {
	const [time] = useState(() => getTimeFromDateString(props.transaction.date));

	return (
		<Stack
			onClick={() => props.onClick(true, props.transaction)}
			className="h-fit p-2 mx-3 bg-neutral-50 rounded-lg overflow-hidden text-slate-900"
		>
			{/* Time */}
			<Typography component="span" variant="caption">
				{time}
			</Typography>
			{/** Title */}
			<Typography
				component="span"
				variant="subtitle1"
				className="text-ellipsis overflow-hidden whitespace-nowrap"
			>
				{props.transaction.description}
			</Typography>
			{/** Price */}
			<AmountDisplay
				amount={props.transaction.amount}
				currency={props.transaction.currency.acronym}
				wholeClass="text-icon text-lg"
				decimalClass="text-icon text-sm"
				className="truncate text-center w-full py-3"
			/>
			<Stack direction="row" gap={0.75}>
				{/* Transaction Type */}
				<div
					className={`text-[8px] uppercase border-[1px] w-fit px-1 rounded-lg ${props.transaction.type.type}`}
				>
					{props.transaction.type.type}
				</div>
				{/* Category */}
				<div className="text-[8px] text-gray-600 uppercase border-[1px] w-fit px-1 rounded-lg">
					{props.transaction?.category?.name ||
						props.transaction?.source?.name ||
						"Transfer"}
				</div>
			</Stack>
		</Stack>
	);
}

export default AlternateTransaction;
