import { useEffect, useState } from "react";

// Interfaces
import { Transaction } from "../../../interfaces/transactions-interface";

// Components
import VerticalTransactions from "./VerticalTransactions";
import HorizontalTransactions from "./HorizontalTransactions";
import TransactionDetailsDialog from "./TransactionDetailsDialog";

interface PropsInterface {
	flow: string;
	transactions: Array<Transaction>;
}

interface Details {
	show: boolean;
	transaction: Transaction | null;
}

function TransactionsList(props: PropsInterface) {
	const [details, setDetails] = useState<Details>({
		show: false,
		transaction: null,
	});

	function setTransactionDetails(
		show: boolean,
		transaction: Transaction | null
	) {
		setDetails({
			show,
			transaction,
		});
	}

	const closeDialog = () =>
		setDetails((prev) => {
			return { ...prev, show: false };
		});

	useEffect(() => {
		function resetSelectedTransaction() {
			setDetails((prev) => {
				return {
					...prev,
					transaction: null,
				};
			});
		}
		details.show === false && resetSelectedTransaction();
	}, [details.show]);

	return (
		<>
			{props.flow === "vertical" ? (
				<VerticalTransactions
					onClick={setTransactionDetails}
					transactions={props.transactions}
				/>
			) : (
				<HorizontalTransactions
					onClick={setTransactionDetails}
					transactions={props.transactions}
				/>
			)}
			<TransactionDetailsDialog
				show={details.show}
				transaction={details.transaction}
				onClose={closeDialog}
			/>
		</>
	);
}

export default TransactionsList;
