import { useState } from "react";

// Formik
import { useFormikContext } from "formik";

// MUI
import { DesktopDatePicker } from "@mui/lab";
import { TextField } from "@mui/material";

// Utilities
import { isMobile } from "../../utilities/mobile-utilities";
import { isValidDate } from "../../utilities/date-utilities";

// Components
import MobileDatePicker from "../mobile/date-picker/MobileDatePicker";

interface PropsInterface {
	required?: boolean;
	fieldName: string;
	label: string;
}

function CustomDatePicker({ fieldName, label, required }: PropsInterface) {
	const formik: any = useFormikContext();

	const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

	function handleChange(inputValue: any) {
		let fieldValue: any = "";
		if (isValidDate(inputValue)) {
			fieldValue = inputValue;
		}
		formik.setFieldValue(fieldName, fieldValue);
	}

	const toggleDatePicker = (value: boolean) => setShowDatePicker(value);

	return (
		<>
			<DesktopDatePicker
				label={label}
				inputFormat="dd/MM/yyyy"
				value={formik.values[fieldName]}
				onChange={handleChange}
				readOnly={isMobile}
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
						autoComplete="off"
						required={required}
						spellCheck={false}
						autoCapitalize="none"
						autoCorrect="off"
						type="number"
						size="small"
						fullWidth
					/>
				)}
			/>
			{showDatePicker && (
				<MobileDatePicker
					value={formik.values[fieldName]}
					onChange={handleChange}
				/>
			)}
		</>
	);
}

export default CustomDatePicker;
