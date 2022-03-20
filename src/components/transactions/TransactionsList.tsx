// Components
import { useState } from "react";
import Transaction from "./Transaction";
import TransactionDetailsDialog from "./TransactionDetailsDialog";

// Interfaces
import { TransactionInterface } from "./transactions-interface";

interface PropsInterface {
  height?: number;
  className?: string;
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
      <div
        className={`overflow-x-hidden overflow-y-auto ${props.className}`}
        style={{
          height: props.height
            ? `${props.height}px`
            : "calc(100% - 24px - 48px)",
        }}
      >
        <ul>
          {props.transactions.map((transaction) => (
            <li key={transaction._id}>
              <Transaction
                onClick={setTransactionDetails}
                transaction={transaction}
              />
            </li>
          ))}
        </ul>
      </div>
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
