import { TouchEvent, useEffect, useState } from "react";

// MUI
import { Button } from "@mui/material";
import { CalendarPicker, CalendarPickerView } from "@mui/lab";

// Date fns
import { isDate } from "date-fns/esm";

// Components
import TouchArea from "../../general/TouchArea";

interface PropsInterface {
	value: string;
	onChange: (a: any, b: boolean) => void;
}

function MobileDatePicker(props: PropsInterface) {
	const [localValue, setLocalValue] = useState<Date | null>(null);
	const [currentView, setCurrentView] = useState<CalendarPickerView>("year");

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

	const submitDate = () =>
		isDate(localValue) && props.onChange(localValue, true);

	return (
		<div className="pb-env">
			<div className="pb-4 px-3">
				<CalendarPicker
					onViewChange={handleViewChange}
					onChange={handleChange}
					view={currentView}
					date={localValue}
					openTo="year"
				/>
				<Button
					onClick={submitDate}
					sx={{ marginTop: 4 }}
					variant="contained"
					fullWidth
				>
					Select Date
				</Button>
			</div>
		</div>
	);
}

export default MobileDatePicker;
