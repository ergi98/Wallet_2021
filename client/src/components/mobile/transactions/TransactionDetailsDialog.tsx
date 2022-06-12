import React, { useMemo, useState } from "react";

// MUI
import {
	Grid,
	Button,
	IconButton,
	DialogActions,
	DialogContent,
} from "@mui/material";

// Icons
import { Delete } from "@mui/icons-material";

// Interface
import { Transaction } from "../../../interfaces/transactions-interface";

// Utilities
import { formatDate } from "../../../utilities/date-utilities";

// Components
import Map from "../../general/Map";
import BottomDialog from "../../general/BottomDialog";
import AmountDisplay from "../../general/AmountDisplay";
import ConfirmDialog from "../../general/ConfirmDialog";

interface PropsInterface {
	show: boolean;
	transaction: Transaction | null;
	onClose: () => void;
}

function TransactionDetailsDialog(props: PropsInterface) {
	const [showConfirm, setShowConfirm] = useState(false);

	const TransactionSourceOrCategory = useMemo(() => {
		if (!props.transaction) return "";
		if ("source" in props.transaction) {
			return props.transaction?.source?.name;
		} else if ("category" in props.transaction) {
			return props.transaction?.category?.name;
		} else return "Transfer";
	}, [props.transaction]);

	const TransactionLocation = useMemo(() => {
		if (!props.transaction) return "";
		if ("location" in props.transaction) {
			return (
				<div className="py-4">
					<Map
						zoom={17}
						className="w-full h-44 rounded-lg border-2"
						location={props.transaction.location}
					/>
				</div>
			);
		} else return "";
	}, [props.transaction]);

	const TransactionPortfolio = useMemo(() => {
		if (!props.transaction) return "";
		if ("portfolio" in props.transaction)
			return (
				<Grid
					className="break-all text-slate-900 bg-neutral-100 flex justify-between items-center"
					sx={{ padding: "16px" }}
					xs={12}
					item
				>
					<span>Portfolio</span>
					<span>{props.transaction?.portfolio?.description}</span>
				</Grid>
			);
		else return "";
	}, [props.transaction]);

	const handleClose = () => props.onClose();

	const toggleConfirmDelete = (val: boolean) => setShowConfirm(val);

	// TODO: Determine edit path
	const goToEdit = () => {
		console.log("here");
	};

	function handleTransactionDelete() {
		toggleConfirmDelete(false);
		console.log("Deleting ...");
	}

	return (
		<>
			<BottomDialog open={props.show} closeOnSwipe={true} onClose={handleClose}>
				<DialogContent sx={{ padding: "0px 0px 12px 0px" }}>
					{/* Location */}
					{TransactionLocation}
					<Grid rowGap={2} container>
						{/* Amount */}
						<Grid className="text-center" xs={12} item>
							<AmountDisplay
								className="self-center text-slate-900"
								amount={props.transaction?.amount ?? 0}
								currency={props.transaction?.currency?.acronym ?? "ALL"}
							/>
						</Grid>
						{/* Amount in default */}
						<Grid
							className="break-all text-slate-900 bg-neutral-100 flex justify-between items-center"
							sx={{ padding: "16px" }}
							xs={12}
							item
						>
							<span>Amount in ALL</span>
							<AmountDisplay
								wholeClass=" text-md"
								decimalClass="text-xs"
								className="self-center text-slate-900"
								amount={props.transaction?.amountInDefault ?? 0}
								currency={"ALL"}
							/>
						</Grid>
						{/* Date */}
						<Grid
							className="break-all text-slate-900 bg-neutral-100 flex justify-between items-center"
							sx={{ padding: "16px" }}
							xs={12}
							item
						>
							<span>Date</span>
							<span>{formatDate(props.transaction?.date ?? "", "long")}</span>
						</Grid>
						{/* Type */}
						<Grid
							className="break-all text-slate-900 bg-neutral-100 flex justify-between items-center"
							sx={{ padding: "16px" }}
							xs={12}
							item
						>
							<span>Type</span>
							<span className="capitalize">
								{props.transaction?.type?.type}
							</span>
						</Grid>
						{/* Source || Category */}
						<Grid
							className="break-all text-slate-900 bg-neutral-100 flex justify-between items-center"
							sx={{ padding: "16px" }}
							xs={12}
							item
						>
							<span>
								{props.transaction?.type?.type === "expense"
									? "Category"
									: "Source"}
							</span>
							<span>{TransactionSourceOrCategory}</span>
						</Grid>
						{/* Portfolio */}
						{TransactionPortfolio}
						{/* Title */}
						<Grid
							className="break-all text-slate-900 bg-neutral-100 flex justify-between items-center"
							sx={{ padding: "16px" }}
							xs={12}
							item
						>
							<span>Title</span>
							<span>{props.transaction?.description}</span>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<IconButton onClick={() => toggleConfirmDelete(true)} size="large">
						<Delete />
					</IconButton>
					<Button
						onClick={goToEdit}
						variant="contained"
						disableElevation
						fullWidth
						size="large"
					>
						Edit
					</Button>
				</DialogActions>
				<div className="pb-env"></div>
			</BottomDialog>
			<ConfirmDialog
				show={showConfirm}
				text="Are you sure you want to delete this transaction?"
				onConfirm={handleTransactionDelete}
				onClose={() => toggleConfirmDelete(false)}
			/>
		</>
	);
}

export default TransactionDetailsDialog;
