// MUI
import { CalendarPicker } from "@mui/lab";
interface PropsInterface {
	value: string;
	onChange: (a: any) => void;
}

function MobileDatePicker(props: PropsInterface) {
	function handleChange(event: any) {
		console.log(event);
	}

	return (
		<div className="pb-env px-3">
			<div className="pb-2">
				<CalendarPicker date={props.value} onChange={handleChange} />
			</div>
		</div>
	);
}

export default MobileDatePicker;
