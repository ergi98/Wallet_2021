// Interfaces
import { TransactionInterface } from "../../../interfaces/transactions-interface";

// Components
import Transaction from "./Transaction";

interface PropsInterface {
	onClick: (a: boolean, b: TransactionInterface | null) => void;
	transactions: Array<TransactionInterface>;
}

function VerticalTransactions(props: PropsInterface) {
	return (
		<div className="-mr-3 pr-3 max-h-80 overflow-x-hidden overflow-y-scroll rounded-b-xl">
			<ul>
				{props.transactions.map((transaction) => (
					<li key={transaction._id}>
						<Transaction onClick={props.onClick} transaction={transaction} />
					</li>
				))}
			</ul>
		</div>
	);
}

export default VerticalTransactions;
