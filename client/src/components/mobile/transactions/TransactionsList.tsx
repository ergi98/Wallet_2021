import { useState } from "react";

// Interfaces
import { TransactionInterface } from "../../../interfaces/transactions-interface";

// Components
import VerticalTransactions from "./VerticalTransactions";
import HorizontalTransactions from "./HorizontalTransactions";
import TransactionDetailsDialog from "./TransactionDetailsDialog";

interface PropsInterface {
	flow: string;
	transactions: Array<TransactionInterface>;
}

interface Details {
	show: boolean;
	transaction: TransactionInterface | null;
}

function TransactionsList(props: PropsInterface) {
	const [details, setDetails] = useState<Details>({
		show: false,
		transaction: null,
	});

	function setTransactionDetails(
		show: boolean,
		transaction: TransactionInterface | null
	) {
		setDetails({
			show,
			transaction,
		});
	}

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
			{details.show && (
				<TransactionDetailsDialog
					show={details.show}
					transaction={details.transaction}
					onClose={setTransactionDetails}
				/>
			)}
		</>
	);
}

export default TransactionsList;
