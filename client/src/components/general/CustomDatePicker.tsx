import { useEffect, useRef, useState } from "react";

// Formik
import { useFormikContext } from "formik";

// MUI
import { TextField } from "@mui/material";
import { DesktopDatePicker } from "@mui/lab";

// Utilities
import { isMobile } from "../../utilities/mobile-utilities";

// Date fns
import { isDate } from "date-fns";

// Components
import BottomDialog from "./BottomDialog";
import MobileDatePicker from "../mobile/date-picker/MobileDatePicker";

interface PropsInterface {
	required?: boolean;
	fieldName: string;
	label: string;
}

function CustomDatePicker({ fieldName, label, required }: PropsInterface) {
	const formik: any = useFormikContext();

	const dateField = useRef<HTMLInputElement>(null);

	const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

	function handleChange(inputValue: any, closeDatePicker: boolean) {
		let fieldValue: Date | null = null;
		if (isDate(inputValue)) {
			fieldValue = new Date(inputValue);
		}
		formik.setFieldValue(fieldName, fieldValue);
		closeDatePicker && toggleDatePicker(false);
	}

	function toggleDatePicker(value: boolean) {
		if (!isMobile) return;
		setShowDatePicker(value);
		// If closing reset the active element
		if (value === false)
			requestAnimationFrame(() => {
				let activeElement = document.activeElement as HTMLElement;
				activeElement.blur();
			});
	}

	return (
		<>
			<DesktopDatePicker
				value={formik.values[fieldName]}
				onChange={(event) => handleChange(event, false)}
				inputRef={dateField}
				readOnly={isMobile}
				label={label}
				renderInput={(params) => (
					<TextField
						{...params}
						name={fieldName}
						onClick={() => toggleDatePicker(true)}
						onBlur={formik.handleBlur}
						error={!!formik.errors[fieldName] && formik.touched[fieldName]}
						helperText={
							!!formik.errors[fieldName] && formik.touched[fieldName]
								? formik.errors[fieldName]
								: " "
						}
						sx={{ ".Mui-disabled": { color: "#757575 !important" } }}
						required={required}
						spellCheck={false}
						autoCapitalize="none"
						autoComplete="off"
						autoCorrect="off"
						type="number"
						size="small"
						fullWidth
					/>
				)}
				inputFormat="dd/MM/yyyy"
			/>
			{showDatePicker && isMobile && (
				<BottomDialog
					open={showDatePicker}
					onClose={toggleDatePicker}
					closeOnSwipe={true}
				>
					<MobileDatePicker
						label={label}
						onChange={handleChange}
						value={formik.values[fieldName]}
					/>
				</BottomDialog>
			)}
		</>
	);
}

export default CustomDatePicker;
