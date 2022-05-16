import { useEffect, useState } from "react";

// MUI
import { Button, Divider, Stack, Typography } from "@mui/material";
import { CalendarPicker, CalendarPickerView } from "@mui/lab";

// Date fns
import { isDate } from "date-fns/esm";

interface PropsInterface {
	value: string;
	label: string;
	view?: CalendarPickerView;
	onChange: (a: Date | null, b: boolean) => void;
}

function MobileDatePicker(props: PropsInterface) {
	const [localValue, setLocalValue] = useState<Date | null>(null);
	const [currentView, setCurrentView] = useState<CalendarPickerView>(
		props.view ?? "year"
	);

	useEffect(() => {
		function initialSetup() {
			let parsedDate = new Date(props.value);
			setLocalValue(isDate(parsedDate) ? parsedDate : null);
		}
		initialSetup();
	}, [props.value]);

	function handleChange(event: any) {
		setLocalValue(event);
		currentView === "year" && setCurrentView("day");
	}

	const handleViewChange = (event: CalendarPickerView) => setCurrentView(event);

	const submitDate = () => props.onChange(localValue, true);

	const clearDate = () => setLocalValue(null);

	return (
		<div className="pb-env">
			<div className="pb-4 px-3">
				<div className="py-3">
					<Typography>{props.label}</Typography>
					<Divider />
				</div>
				<CalendarPicker
					onViewChange={handleViewChange}
					onChange={handleChange}
					view={currentView}
					date={localValue}
					openTo="year"
				/>
				<Divider className="pt-3" />
				<Stack className="pt-3" direction="row">
					<Button onClick={clearDate} variant="text" fullWidth>
						Clear
					</Button>
					<Button onClick={submitDate} variant="contained" fullWidth>
						Done
					</Button>
				</Stack>
			</div>
		</div>
	);
}

export default MobileDatePicker;
