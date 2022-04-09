import { ReactNode } from "react";

// MUI
import { Stack, Typography } from "@mui/material";

// Navigation
import { Link, useNavigate } from "react-router-dom";

// Interfaces
import { TransactionInterface } from "../../../interfaces/transactions-interface";

// Components
import TransactionsList from "../transactions/TransactionsList";
import SelectTransactionTypeMenu from "./SelectTransactionTypeMenu";

interface PropsInterface {
	children: ReactNode;
}

const transaction: Array<TransactionInterface> = [
	// Expense
	{
		_id: "5f7f2fd6323a3b0017e1ec1d",
		date: new Date().toISOString(),
		type: "expense",
		title: "Kafe tek Moncheriaaa aaaaaaaaaaa aaaa  a aaaaaaaaaa aaaaaaa",
		amount: 2000,
		currency: "ALL",
		portfolio: "5f8351f9d4d24d00172cd7bc",
		location: {
			longitude: 19.834378436425062,
			latitude: 41.33407116183822,
		},
		currencyRate: 1,
		category: "Entertainment",
		description: "Ika per kafe te moncheria te shtunen ne mgjes.",
		deleted: false,
	},
	{
		_id: "5f7f2fd6323a3b0017e1ec1e",
		date: new Date().toISOString(),
		type: "earning",
		title: "Rroga ESDP",
		amount: 123456789,
		currency: "ALL",
		portfolio: "5f8351f9d4d24d00172cd7bd",
		description: "Kalimi i rroges nga ESDP",
		currencyRate: 1,
		source: "Job",
		deleted: false,
	},
	{
		_id: "5f7f2fd6323a3b0017e1ec1f",
		date: new Date().toISOString(),
		type: "expense",
		title: "Kafe tek Moncheria",
		amount: 2000,
		currency: "ALL",
		portfolio: "5f8351f9d4d24d00172cd7bc",
		location: {
			longitude: 19.834378436425062,
			latitude: 41.33407116183822,
		},
		currencyRate: 1,
		category: "Entertainment",
		description: "Ika per kafe te moncheria te shtunen ne mgjes.",
		deleted: false,
	},
	{
		_id: "5f7f2fd6323a3b0017e1ec31f",
		date: new Date().toISOString(),
		type: "expense",
		title: "Kafe tek Moncheria",
		amount: 2000,
		currency: "ALL",
		portfolio: "5f8351f9d4d24d00172cd7bc",
		location: {
			longitude: 19.834378436425062,
			latitude: 41.33407116183822,
		},
		currencyRate: 1,
		category: "Entertainment",
		description: "Ika per kafe te moncheria te shtunen ne mgjes.",
		deleted: false,
	},
	{
		_id: "5f7f2fd6323a3b0017e1ec11f",
		date: new Date().toISOString(),
		type: "expense",
		title: "Kafe tek Moncheria",
		amount: 2000,
		currency: "ALL",
		portfolio: "5f8351f9d4d24d00172cd7bc",
		location: {
			longitude: 19.834378436425062,
			latitude: 41.33407116183822,
		},
		currencyRate: 1,
		category: "Entertainment",
		description: "Ika per kafe te moncheria te shtunen ne mgjes.",
		deleted: false,
	},
	{
		_id: "5f7f2fd6323a3b0017e1ecze",
		date: new Date().toISOString(),
		type: "earning",
		title: "Lek nga te shpis",
		amount: 13000,
		currency: "ALL",
		portfolio: "5f8351f9d4d24d00172cd7bd",
		description: "Kalimi i rroges nga ESDP",
		currencyRate: 1,
		source: "Job",
		deleted: false,
	},
];

function Home(props: PropsInterface) {
	const navigate = useNavigate();
	const goTo = (url: string) => navigate(url);

	return (
		<div className="app-height relative overflow-x-hidden overflow-y-auto">
			{props.children}
			<div className="py-3">
				<div className="px-3 pb-6">
					<Stack
						direction="row"
						alignItems="center"
						justifyContent="space-between"
					>
						<div>
							<Typography variant="h6">Today's Transactions</Typography>
							<Link
								className="text-sm underline underline-offset-2"
								to="/transactions"
							>
								View all transactions
							</Link>
						</div>
						<SelectTransactionTypeMenu />
					</Stack>
				</div>
				<TransactionsList transactions={transaction} flow="horizontal" />
			</div>
		</div>
	);
}

export default Home;
