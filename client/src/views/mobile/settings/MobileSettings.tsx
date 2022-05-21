// MUI
import { LoadingButton } from "@mui/lab";
import { Stack, Typography } from "@mui/material";

// Icons
import { LogoutOutlined } from "@mui/icons-material";

// Axios
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

// Components
import TransactionsSettings from "../../../components/shared/settings/TransactionsSettings";
import CategoryAndSourcesSettings from "../../../components/shared/settings/CategoryAndSourcesSettings";

// Redux
import { logoutUser } from "../../../features/auth/auth-slice";
import { useAppDispatch, useAppSelector } from "../../../redux_store/hooks";

function MobileSettings() {
	const axios = useAxiosPrivate();
	const dispatch = useAppDispatch();

	const loading = useAppSelector((state) => state.auth.loading);

	const logOut = () => dispatch(logoutUser(axios));

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
					loading={loading}
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
