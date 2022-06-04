import React, { useMemo } from "react";

// MUI
import {
	Button,
	DialogActions,
	DialogContent,
	DialogTitle,
} from "@mui/material";

// Formik
import { Formik } from "formik";

// Redux
import { useAppSelector } from "../../../redux_store/hooks";

// Validation
import {
	editTransactionSchema,
	newTransactionSchema,
} from "../../../validators/transaction";

// Hooks
import useLocalContext from "../../../hooks/useLocalContext";

// Icons
import { RiCloseLine, RiRestartLine } from "react-icons/ri";

// Utilities
import { toObject } from "../../../utilities/general-utilities";

// Components
import AmountInput from "../../general/AmountInput";
import BottomDialog from "../../general/BottomDialog";
import HorizontalSelect from "../../general/HorizontalSelect";

interface PropsInterface {
	show: boolean;
	mode: "add" | "edit";
	onClose: () => void;
}

interface FormikValues {
	to: string;
	type: string;
	date: string;
	from: string;
	amount: number;
	source: string;
	category: string;
	currency: string;
	portfolio: string;
	description: string;
	location: {
		latitude: number;
		longitude: number;
	};
}

function TransactionForm(props: PropsInterface) {
	const transactionTypes = useAppSelector(
		(state) => state.transaction.transactionTypes
	);

	const defaultCurrency = useAppSelector(
		(state) => state.user.user?.defaultCurrency
	);

	const initialState = {
		to: "",
		type: transactionTypes[0]?._id,
		date: "",
		from: "",
		amount: 0,
		source: "",
		category: "",
		currency: defaultCurrency ? defaultCurrency._id : "",
		portfolio: "",
		description: "",
		location: {
			latitude: 0,
			longitude: 0,
		},
	};

	const validationSchema = useMemo(() => {
		const typesObject = toObject(transactionTypes, "type", "_id");
		return props.mode === "add"
			? newTransactionSchema(typesObject)
			: editTransactionSchema(typesObject);
	}, [props.mode, transactionTypes]);

	function handleSubmit(values: FormikValues) {
		console.log("Hey");
	}

	return (
		<BottomDialog open={props.show} onClose={props.onClose} closeOnSwipe={true}>
			<DialogTitle className="flex justify-between">
				{props.mode === "add" ? "New Transaction" : "Edit Transaction"}
				<Button
					size="small"
					variant="outlined"
					startIcon={props.mode === "add" ? <RiCloseLine /> : <RiRestartLine />}
				>
					{props.mode === "add" ? "Clear" : "Reset"}
				</Button>
			</DialogTitle>
			<DialogContent>
				<Formik
					initialValues={initialState}
					validationSchema={validationSchema}
					onSubmit={(values: FormikValues) => handleSubmit(values)}
				>
					{(props) => (
						<form onSubmit={props.handleSubmit} noValidate>
							<div className="pb-5">
								<HorizontalSelect
									value={props.values.type}
									options={transactionTypes}
									select={(value: string) => props.setFieldValue("type", value)}
								/>
							</div>
							<AmountInput
								amount={props.values.amount}
								touched={props.touched.amount}
								currency={props.values.currency}
								amountError={props.errors.amount}
								onAmountTouch={() => props.setFieldTouched("amount", true)}
								onAmountChange={(value: number) =>
									props.setFieldValue("amount", value, true)
								}
								onCurrencyChange={(value: string) =>
									props.setFieldValue("currency", value, true)
								}
							/>
						</form>
					)}
				</Formik>
			</DialogContent>
			<DialogActions></DialogActions>
			<div className="pb-env"></div>
		</BottomDialog>
	);
}

export default TransactionForm;
