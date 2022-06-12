import { useEffect, useState } from "react";

// MUI
import { Stack, Typography } from "@mui/material";

// Interfaces
import {
	PortfolioColors,
	PortfolioInterface,
} from "../../../interfaces/portfolios-interface";
import { determinePortfolioColor } from "../../../utilities/portfolio-utilities";

// Components
import AmountDisplay from "../../general/AmountDisplay";

interface PropsInterface {
	portfolio: PortfolioInterface;
}

function Portfolio(props: PropsInterface) {
	const [colorSet] = useState<PortfolioColors | undefined>(() => {
		let colors = determinePortfolioColor(props.portfolio.color);
		return colors;
	});

	if (!colorSet) return <div>Invalid color</div>;
	return (
		<div className="relative rounded-xl p-3 mx-3 shadow-md text-neutral-50 h-36 overflow-hidden">
			{/* Background Circles */}
			<div
				className={`${colorSet.first} bg-gradient-to-br absolute inset-0 h-full w-full `}
				style={{ clipPath: "circle(150% at 0 0)" }}
			/>
			<div
				className={`${colorSet.second} bg-gradient-to-br absolute inset-0 h-full w-full`}
				style={{ clipPath: "circle(110% at 0 0)" }}
			/>
			<div
				className={`${colorSet.third} bg-gradient-to-br absolute inset-0 h-full w-full`}
				style={{ clipPath: "circle(80% at 0 0)" }}
			/>
			<div
				className={`${colorSet.fourth} bg-gradient-to-br absolute inset-0 h-full w-full`}
				style={{ clipPath: "circle(50% at 0 0)" }}
			/>
			<div className="absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-800 via-neutral-300 to-neutral-800 opacity-10" />
			{/* Card Content */}
			<Stack
				justifyContent="space-between"
				className="relative px-3 z-10 h-full"
			>
				<Typography variant="h6">{props.portfolio.name}</Typography>
				<AmountDisplay
					currency={props.portfolio.currency}
					amount={props.portfolio.amount}
					className="self-center mb-3"
					decimalClass="text-xl"
					wholeClass="text-3xl"
				/>
				<Typography className="uppercase" variant="subtitle2">
					{props.portfolio.type}
				</Typography>
			</Stack>
		</div>
	);
}

export default Portfolio;
