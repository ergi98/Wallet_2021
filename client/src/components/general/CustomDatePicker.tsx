import { useEffect, useRef, useState } from "react";

// Formik
import { useFormikContext } from "formik";

// MUI
import { DesktopDatePicker } from "@mui/lab";
import { TextField } from "@mui/material";

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

	useEffect(() => {
		if (showDatePicker === false && dateField.current) dateField.current.blur();
	}, [showDatePicker]);

	const toggleDatePicker = (value: boolean) => {
		isMobile && setShowDatePicker(value);
	};

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
						sx={{ ".Mui-disabled": { color: "#757575" } }}
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
						value={formik.values[fieldName]}
						onChange={handleChange}
					/>
				</BottomDialog>
			)}
		</>
	);
}

export default CustomDatePicker;