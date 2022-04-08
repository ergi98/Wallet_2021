import { useState } from "react";

// MUI
import { LoadingButton } from "@mui/lab";
import { Stack, Typography } from "@mui/material";

// Icons
import { LogoutOutlined } from "@mui/icons-material";

// Axios
import { AxiosInstance, clearAxiosInstance } from "../../../axios/axios-config";

// Utilities
import { withTryCatch } from "../../../utilities/general-utilities";

// Navigate
import { useNavigate } from "react-router-dom";

// Auth
import { useAuthUpdate } from "../../../context/AuthContext";

// Components
import TransactionsSettings from "../../../components/shared/settings/TransactionsSettings";
import CategoryAndSourcesSettings from "../../../components/shared/settings/CategoryAndSourcesSettings";

function MobileSettings() {
	const navigate = useNavigate();
	const updateAuth = useAuthUpdate();

	const [isLoading, setIsLoading] = useState<boolean>(false);

	async function logOut() {
		setIsLoading(true);
		let { data } = await withTryCatch(AxiosInstance.post("/auth/log-out"));
		setIsLoading(false);
		if (data) {
			localStorage.clear();
			clearAxiosInstance();
			updateAuth &&
				updateAuth({
					isAuthenticated: false,
				});
			navigate("/", { replace: true });
		}
	}

	return (
		<div className="app-height relative overflow-x-hidden overflow-y-auto p-3">
			<Typography variant="h5" sx={{ fontWeight: "bold" }}>
				Settings
			</Typography>
			<Stack className="py-6">
				<div className="bg-neutral-50 rounded-xl mb-6 px-3 py-2 shadow-md">
					<CategoryAndSourcesSettings />
				</div>
				<div className="bg-neutral-50 rounded-xl mb-6 px-3 py-2 shadow-md">
					<TransactionsSettings />
				</div>
				<LoadingButton
					onClick={logOut}
					loading={isLoading}
					startIcon={<LogoutOutlined />}
					aria-label="logout"
					variant="contained"
					color="error"
					loadingPosition="center"
				>
					Log Out
				</LoadingButton>
			</Stack>
		</div>
	);
}

export default MobileSettings;
