import { ReactNode, useEffect, useMemo, useState } from "react";

// MUI
import { Stack, Typography } from "@mui/material";

// Navigation
import { Link } from "react-router-dom";

// Redux
import {
	setDate,
	fetchHomeData,
	setFetchedDate,
} from "../../../features/home/home-slice";
import { useAppDispatch, useAppSelector } from "../../../redux_store/hooks";

// Date
import { isToday } from "date-fns";
import { formatDate } from "../../../utilities/date-utilities";

// Components
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useLocalContext from "../../../hooks/useLocalContext";
import TransactionsList from "../transactions/TransactionsList";
import SelectTransactionTypeMenu from "./SelectTransactionTypeMenu";
import { fetchTransactions } from "../../../features/transactions/transaction-slice";

interface PropsInterface {
	children: ReactNode;
}

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
	const transactions = useAppSelector(
		(state) => state.transaction.transactions
	);

	const fetchedDate = useAppSelector((state) => state.home.fetchedDate);

	const [localContext, persistContext] = useLocalContext<HomeCTX>("home", {
		date,
		path,
	});

	const transactionsTitle = useMemo(() => {
		if (isToday(new Date(date))) {
			return "Today's Transactions";
		} else {
			const formattedDate = formatDate(date).split(" ");
			return `${formattedDate[0]} ${formattedDate[1]} Transactions`;
		}
	}, [date]);

	useEffect(() => {
		localContext.date !== date && dispatch(setDate(localContext.date));
		setFetchedFromContext(true);
	}, []);

	useEffect(() => {
		if (fetchedDate !== date && fetchedFromContext) {
			dispatch(fetchHomeData({ axios, date }));
			dispatch(setFetchedDate(date));
			dispatch(
				fetchTransactions({
					axios,
					filters: {
						dateRange: {
							from: new Date(new Date(date).setHours(0, 0, 0, 0)).toISOString(),
							to: new Date(
								new Date(date).setHours(23, 59, 59, 999)
							).toISOString(),
						},
					},
				})
			);
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
							<Typography variant="h6">{transactionsTitle}</Typography>
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
				<TransactionsList transactions={transactions} flow="horizontal" />
			</div>
		</div>
	);
}

export default Home;
