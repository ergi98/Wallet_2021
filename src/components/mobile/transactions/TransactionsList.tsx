// Components
import { useState } from "react";
import Transaction from "./Transaction";
import TransactionDetailsDialog from "./TransactionDetailsDialog";

// Interfaces
import { TransactionInterface } from "../../../interfaces/transactions-interface";

interface PropsInterface {
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
      <div className="-mr-3 pr-3 max-h-80 overflow-x-hidden overflow-y-scroll rounded-b-xl">
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
