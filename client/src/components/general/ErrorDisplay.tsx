import { useEffect, useState } from "react";

// MUI
import { Alert, Slide, Snackbar, SnackbarCloseReason } from "@mui/material";

// Hooks
import useError from "../../hooks/useError";
import { useLocation } from "react-router-dom";

interface Message {
	show: boolean;
	content: string;
}

function ErrorDisplay() {
	const location = useLocation();
	const { error, handleError } = useError();
	const [message, setMessage] = useState<Message>({
		show: false,
		content: "",
	});

	useEffect(() => {
		location.pathname !== "/" &&
			setMessage({
				show: Boolean(error),
				content: error,
			});
	}, [error, location.pathname]);

	function clearError(_: any, reason: SnackbarCloseReason) {
		if (reason === "clickaway") return;
		handleError && handleError("");
	}

	return (
		<Snackbar
			open={message.show}
			onClose={clearError}
			autoHideDuration={2500}
			style={{ display: message.show ? "block" : "none" }}
			anchorOrigin={{ vertical: "top", horizontal: "center" }}
			TransitionComponent={(props) => <Slide {...props} direction="down" />}
		>
			<Alert severity="error">{message.content}</Alert>
		</Snackbar>
	);
}

export default ErrorDisplay;
