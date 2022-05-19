import { ReactNode, useEffect, useState } from "react";

// MUI
import { Stack, Typography } from "@mui/material";

// Navigation
import { Link } from "react-router-dom";

// Interfaces
import { Transaction } from "../../../interfaces/transactions-interface";

// Redux
import {
	setDate,
	fetchHomeData,
	setFetchedDate,
} from "../../../features/home/home-slice";
import { useAppDispatch, useAppSelector } from "../../../redux_store/hooks";

// Components
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useLocalContext from "../../../hooks/useLocalContext";
import TransactionsList from "../transactions/TransactionsList";
import SelectTransactionTypeMenu from "./SelectTransactionTypeMenu";

interface PropsInterface {
	children: ReactNode;
}

const transaction: Array<Transaction> = [];

interface HomeCTX {
	date: string;
	path: string;
}

function Home(props: PropsInterface) {
	const [fetchedFromContext, setFetchedFromContext] = useState(false);

	const dispatch = useAppDispatch();
	const axios = useAxiosPrivate();
	const date = useAppSelector((state) => state.home.date);
	const path = useAppSelector((state) => state.home.path);

	const fetchedDate = useAppSelector((state) => state.home.fetchedDate);

	const [localContext, persistContext] = useLocalContext<HomeCTX>("home", {
		date,
		path,
	});

	useEffect(() => {
		localContext.date !== date && dispatch(setDate(localContext.date));
		setFetchedFromContext(true);
	}, []);

	useEffect(() => {
		if (fetchedDate !== date && fetchedFromContext) {
			dispatch(fetchHomeData({ axios, date }));
			dispatch(setFetchedDate(date));
			persistContext("home", { date, path });
		}
	}, [date, fetchedFromContext]);

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
