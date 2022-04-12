import { useEffect, useState } from "react";

// MUI
import { Alert, Slide, Snackbar, SnackbarCloseReason } from "@mui/material";
import useError from "../../hooks/useError";

interface Message {
	show: boolean;
	content: string;
}

function ErrorDisplay() {
	const { error, handleError } = useError();
	const [message, setMessage] = useState<Message>({
		show: false,
		content: "",
	});

	useEffect(() => {
		setMessage({
			show: Boolean(error),
			content: error,
		});
	}, [error]);

	function clearError(_: any, reason: SnackbarCloseReason) {
		if (reason === "clickaway") return;
		handleError && handleError("");
	}
	return (
		<Snackbar
			open={message.show}
			onClose={clearError}
			autoHideDuration={2500}
			anchorOrigin={{ vertical: "top", horizontal: "center" }}
			TransitionComponent={(props) => <Slide {...props} direction="down" />}
		>
			<Alert severity="error">{message.content}</Alert>
		</Snackbar>
	);
}

export default ErrorDisplay;
