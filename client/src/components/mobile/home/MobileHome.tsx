import { ReactNode, useEffect } from "react";

// MUI
import { Stack, Typography } from "@mui/material";

// Navigation
import { Link } from "react-router-dom";

// Interfaces
import {
	EarningTransaction,
	ExpenseTransaction,
	TransferTransaction,
} from "../../../interfaces/transactions-interface";

// Components
import TransactionsList from "../transactions/TransactionsList";
import SelectTransactionTypeMenu from "./SelectTransactionTypeMenu";

interface PropsInterface {
	children: ReactNode;
}

const transaction: Array<
	EarningTransaction | ExpenseTransaction | TransferTransaction
> = [];

function Home(props: PropsInterface) {
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
