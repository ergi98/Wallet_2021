import React, { ReactNode } from "react";

// MUI
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Grow,
	IconButton,
} from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";

const Transition = React.forwardRef(function Transition(props: any, ref: any) {
	return <Grow ref={ref} {...props} unmountOnExit />;
});

interface PropsInterface {
	text: string;
	show: boolean;
	confirmText?: string;
	confirmIcon?: ReactNode;
	onClose: () => void;
	onConfirm: () => void;
}

function ConfirmDialog(props: PropsInterface) {
	const handleClose = (_: any, reason: string) =>
		reason !== "backdropClick" && props.onClose();

	return (
		<Dialog
			className="px-env"
			open={props.show}
			onClose={handleClose}
			TransitionComponent={Transition}
			sx={{
				"& .MuiPaper-root": {
					borderRadius: "15px",
				},
			}}
			keepMounted
		>
			<DialogTitle className="text-right">
				<IconButton onClick={props.onClose} aria-label="close">
					<CloseOutlined sx={{ fontSize: 20 }} />
				</IconButton>
			</DialogTitle>
			<DialogContent>
				<DialogContentText>{props.text}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={props.onClose} color="inherit">
					Cancel
				</Button>
				<Button
					onClick={props.onConfirm}
					startIcon={props.confirmIcon}
					variant="contained"
					color="error"
					autoFocus
				>
					{props.confirmText ?? "Confirm"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default ConfirmDialog;
