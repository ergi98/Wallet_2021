// Components
import Transaction from "./Transaction";

// Interfaces
import TransactionInterface from "./transactions-interface";

interface PropsInterface {
  height?: number;
  className?: string;
  transactions: Array<TransactionInterface>;
}

function TransactionsList(props: PropsInterface) {
  return (
    <div
      className={`overflow-x-hidden overflow-y-auto ${props.className}`}
      style={{
        height: props.height ? `${props.height}px` : "calc(100% - 24px - 48px)",
      }}
    >
      <ul>
        {props.transactions.map((transaction) => (
          <li key={transaction._id}>
            <Transaction transaction={transaction} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TransactionsList;
