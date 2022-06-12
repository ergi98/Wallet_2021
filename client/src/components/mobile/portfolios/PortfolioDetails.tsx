import { useEffect, useState } from "react";

// MUI
import { Button, Stack } from "@mui/material";

// Icons
import { RiEqualizerLine } from "react-icons/ri";

// Interfaces
import { PortfolioDetailsInterface } from "../../../interfaces/portfolios-interface";

// Components
import PortfolioActivity from "./PortfolioActivity";
import PortfolioStatistics from "./PortfolioStatistics";
import PortfolioTransactions from "./PortfolioTransactions";

interface PropsInterface {
	id: string;
}

const portfolios: Array<PortfolioDetailsInterface> = [
	{
		_id: "6023423j4kl32j4kl32j4",
		currency: "ALL",
		last: {
			earnings: new Date().toISOString(),
			expenses: new Date().toDateString(),
		},
		averages: {
			earnings: 250000,
			expenses: 212.12,
		},
		counts: {
			earnings: 10,
			expenses: 2,
		},
		transactions: [],
		topSources: [],
		topCategories: [],
	},
	{
		_id: "6023423j4kl32j4kl32j5",
		currency: "ALL",
		last: {
			earnings: new Date().toISOString(),
			expenses: new Date().toDateString(),
		},
		averages: {
			earnings: 250,
			expenses: 23412.0,
		},
		counts: {
			earnings: 5,
			expenses: 15,
		},
		transactions: [],
		topSources: [],
		topCategories: [],
		cvc: "123",
		bank: "Raiffeisen Bank",
		cardNo: "5674364736271623",
		validity: "12/22",
	},
];

function PortfolioDetails(props: PropsInterface) {
	const [details] = useState<PortfolioDetailsInterface | undefined>(() => {
		let portfolio = portfolios.find((portfolio) => portfolio._id === props.id);
		return portfolio;
	});

	if (!details) return <div>No portfolio selected</div>;
	return (
		<div className="pb-6">
			{details ? (
				<Stack rowGap={3}>
					<Button
						sx={{ color: "inherit", borderColor: "inherit !important" }}
						endIcon={<RiEqualizerLine className="scale-75" />}
						className="mb-3 flex-grow-0 w-fit ml-auto border-neutral-50"
						variant="outlined"
						size="small"
					>
						Filter
					</Button>
					<PortfolioStatistics details={details} />
					<PortfolioActivity />
					<PortfolioTransactions transactions={details.transactions} />
				</Stack>
			) : null}
		</div>
	);
}

export default PortfolioDetails;
