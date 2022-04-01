import { Dialog } from "@mui/material";
import { ReactChild } from "react";

interface PropsInterface {
	open: boolean;
	children: ReactChild;
	onClose: (a: boolean) => void;
}

function BottomDialog(props: PropsInterface) {
	return (
		<Dialog
			sx={{
				".MuiDialog-container": {
					alignItems: "flex-end",
				},
				".MuiPaper-root": {
					margin: 0,
					width: "100%",
					borderTopLeftRadius: "1.5rem",
					borderTopRightRadius: "1.5rem",
				},
			}}
			onBackdropClick={() => props.onClose(false)}
			onClose={() => props.onClose(false)}
			open={props.open}
		>
			{props.children}
		</Dialog>
	);
}

export default BottomDialog;
