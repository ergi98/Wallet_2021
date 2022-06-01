import React, { useMemo } from "react";

// MUI
import { DialogActions, DialogContent, DialogTitle } from "@mui/material";

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

// Utilities
import { toObject } from "../../../utilities/general-utilities";

// Components
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

	const [localContext] = useLocalContext("new-transaction", {
		to: "",
		type: transactionTypes[0]._id,
		date: "",
		from: "",
		amount: 0,
		source: "",
		category: "",
		currency: "",
		portfolio: "",
		description: "",
		location: {
			latitude: 0,
			longitude: 0,
		},
	});

	const validationSchema = useMemo(() => {
		const typesObject = toObject(transactionTypes, "type", "_id");
		props.mode === "add"
			? newTransactionSchema(typesObject)
			: editTransactionSchema(typesObject);
	}, [props.mode, transactionTypes]);

	function handleSubmit(values: FormikValues) {
		console.log("Hey");
	}

	return (
		<BottomDialog open={props.show} onClose={props.onClose} closeOnSwipe={true}>
			<DialogTitle>
				{props.mode === "add" ? "New Transaction" : "Edit Transaction"}
			</DialogTitle>
			<DialogContent>
				<Formik
					initialValues={localContext}
					validationSchema={validationSchema}
					onSubmit={(values: FormikValues) => handleSubmit(values)}
				>
					{(props) => (
						<form onSubmit={props.handleSubmit} noValidate>
							<HorizontalSelect
								value={props.values.type}
								options={transactionTypes}
								select={(value: string) => props.setFieldValue("type", value)}
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
