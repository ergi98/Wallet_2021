import { useState } from "react";

// MUI
import { IconButton, Stack } from "@mui/material";
import BottomDialog from "../../general/BottomDialog";
// Icons
import { RiArrowLeftRightLine, RiEqualizerLine } from "react-icons/ri";

// Redux
import { setPath, setDate } from "../../../features/home/home-slice";
import { useAppDispatch, useAppSelector } from "../../../redux_store/hooks";

// Navigation
import { useNavigate } from "react-router-dom";

// Components
import MobileDatePicker from "../date-picker/MobileDatePicker";

function HomeTopActions() {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const [showDateFilter, setShowDateFilter] = useState<boolean>(false);

	const currentDate = useAppSelector((state) => state.home.date);
	const currentPath = useAppSelector((state) => state.home.path);

	const swapClick = () => {
		const nextPath = currentPath === "expenses" ? "earnings" : "expenses";
		dispatch(setPath(nextPath));
		navigate(`/home/${nextPath}`);
	};

	const toggleDateFilter = (event: boolean) => setShowDateFilter(event);

	const handleDateChange = (event: Date | null, value: boolean) => {
		const newDate = event
			? new Date(event).toISOString()
			: new Date().toISOString();
		dispatch(setDate(newDate));
		toggleDateFilter(false);
	};

	return (
		<>
			<Stack direction="row" className="p-3" justifyContent="space-between">
				<IconButton
					onClick={() => toggleDateFilter(true)}
					sx={{ fontSize: "16px" }}
				>
					<RiEqualizerLine className="text-neutral-50" />
				</IconButton>
				<IconButton onClick={swapClick} sx={{ fontSize: "16px" }}>
					<RiArrowLeftRightLine className="text-neutral-50" />
				</IconButton>
			</Stack>
			<BottomDialog
				closeOnSwipe={true}
				open={showDateFilter}
				onClose={() => toggleDateFilter(false)}
			>
				<MobileDatePicker
					label=""
					view="day"
					value={currentDate}
					onChange={handleDateChange}
				/>
			</BottomDialog>
		</>
	);
}

export default HomeTopActions;
