import { useState, useEffect } from "react";

// Formik
import { useFormikContext } from "formik";

// MUI
import { MenuItem, TextField } from "@mui/material";

// Utilities
import { isMobile } from "../../utilities/mobile-utilities";

// Components
import BottomDialog from "./BottomDialog";
import MobileSelect from "../mobile/select/MobileSelect";

interface SelectOption {
	text: string;
	value: string;
}

interface PropsInterface {
	label: string;
	fieldName: string;
	required?: boolean;
	options?: Array<SelectOption>;
}

function CustomSelect({ fieldName, label, options, required }: PropsInterface) {
	const formik: any = useFormikContext();

	const [showSelect, setShowSelect] = useState<boolean>(false);
	const [selectOptions] = useState<Array<any>>(() => options || []);

	const handleFocus = () => isMobile && setShowSelect(true);

	function toggleShowSelect(value: boolean) {
		setShowSelect(value);
		if (value) return;
		requestAnimationFrame(() => {
			let activeElement = document.activeElement as HTMLElement;
			activeElement.blur();
		});
	}

	function handleMobileChange(value: Array<string> | string) {
		formik.setFieldValue(fieldName, value);
		setShowSelect(false);
	}

	return (
		<>
			<TextField
				label={label}
				name={fieldName}
				onClick={handleFocus}
				onBlur={formik.handleBlur}
				onChange={formik.handleChange}
				value={formik.values[fieldName]}
				error={!!formik.errors[fieldName] && formik.touched[fieldName]}
				helperText={
					!!formik.errors[fieldName] && formik.touched[fieldName]
						? formik.errors[fieldName]
						: " "
				}
				SelectProps={{
					readOnly: isMobile,
				}}
				required={required}
				autoComplete="off"
				size="small"
				fullWidth
				select
			>
				{selectOptions.map((option) => (
					<MenuItem key={option.value} value={option.value}>
						{option.text}
					</MenuItem>
				))}
			</TextField>
			{showSelect && isMobile && (
				<BottomDialog
					open={showSelect}
					onClose={toggleShowSelect}
					closeOnSwipe={true}
				>
					<MobileSelect
						search={true}
						options={selectOptions}
						label={"Select Gender"}
						value={formik.values[fieldName]}
						onChange={handleMobileChange}
					/>
				</BottomDialog>
			)}
		</>
	);
}

export default CustomSelect;
