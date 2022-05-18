import { ReactNode, useEffect } from "react";

// MUI
import { Stack, Typography } from "@mui/material";

// Navigation
import { Link } from "react-router-dom";

// Interfaces
import { Transaction } from "../../../interfaces/transactions-interface";

// Redux
import { fetchHomeData } from "../../../features/home/home-slice";
import { useAppDispatch, useAppSelector } from "../../../redux_store/hooks";

// Components
import TransactionsList from "../transactions/TransactionsList";
import SelectTransactionTypeMenu from "./SelectTransactionTypeMenu";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

interface PropsInterface {
	children: ReactNode;
}

const transaction: Array<Transaction> = [];

function Home(props: PropsInterface) {
	const dispatch = useAppDispatch();
	const axios = useAxiosPrivate();
	const date = useAppSelector((state) => state.home.date);

	useEffect(() => {
		dispatch(fetchHomeData(axios));
	}, [date]);

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
