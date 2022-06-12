import { ReactNode, useEffect, useMemo, useState } from "react";

// Icons
import { RiAddFill } from "react-icons/ri";

// MUI
import { Button, Stack, Typography } from "@mui/material";

// Navigation
import { Link } from "react-router-dom";

// Redux
import {
	setDate,
	fetchHomeData,
	setFetchedDate,
} from "../../../features/home/home-slice";
import { useAppDispatch, useAppSelector } from "../../../redux_store/hooks";
import { fetchTransactions } from "../../../features/transactions/transaction-slice";

// Date
import { isToday } from "date-fns";
import { formatDate } from "../../../utilities/date-utilities";

// Components
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useLocalContext from "../../../hooks/useLocalContext";
import TransactionForm from "../transactions/TransactionForm";
import TransactionsList from "../transactions/TransactionsList";

interface PropsInterface {
	children: ReactNode;
}

interface HomeCTX {
	date: string;
	path: string;
}

function Home(props: PropsInterface) {
	const axios = useAxiosPrivate();
	const dispatch = useAppDispatch();

	const transactions = useAppSelector(
		(state) => state.transaction.transactions
	);
	const date = useAppSelector((state) => state.home.date);
	const path = useAppSelector((state) => state.home.path);
	const fetchedDate = useAppSelector((state) => state.home.fetchedDate);

	const [showDialog, setShowDialog] = useState(false);
	const [fetchedFromContext, setFetchedFromContext] = useState(false);

	const [localContext, persistContext] = useLocalContext<HomeCTX>("home", {
		date,
		path,
	});

	const toggleAddTransaction = (value: boolean) => setShowDialog(value);

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
	}, [localContext.date, date, dispatch]);

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
	}, [
		date,
		path,
		axios,
		fetchedDate,
		fetchedFromContext,
		dispatch,
		persistContext,
	]);

	return (
		<>
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
							<Button
								onClick={() => toggleAddTransaction(true)}
								endIcon={<RiAddFill className=" scale-75" />}
								sx={{ color: "inherit", borderColor: "inherit !important" }}
								className="border-neutral-50"
								variant="outlined"
								size="small"
							>
								New
							</Button>
						</Stack>
					</div>
					<TransactionsList transactions={transactions} flow="horizontal" />
				</div>
			</div>
			{showDialog && (
				<TransactionForm
					mode="add"
					show={showDialog}
					onClose={() => toggleAddTransaction(false)}
				/>
			)}
		</>
	);
}

export default Home;
