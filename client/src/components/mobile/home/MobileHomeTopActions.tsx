// MUI
import { IconButton, Stack } from "@mui/material";

// Icons
import { RiArrowLeftRightLine, RiEqualizerLine } from "react-icons/ri";

interface PropsInterface {
	date: string;
	swapClick: () => void;
	changeDate: (a: string) => void;
}
function HomeTopActions(props: PropsInterface) {
	function openDateFilter() {}
	return (
		<Stack direction="row" className="p-3" justifyContent="space-between">
			<IconButton onClick={openDateFilter} sx={{ fontSize: "16px" }}>
				<RiEqualizerLine className="text-neutral-50" />
			</IconButton>
			<IconButton onClick={() => props.swapClick()} sx={{ fontSize: "16px" }}>
				<RiArrowLeftRightLine className="text-neutral-50" />
			</IconButton>
		</Stack>
	);
}

export default HomeTopActions;
