// Icons
import { ChevronRightOutlined } from "@mui/icons-material";

// MUI
import { Button, Stack, TextField } from "@mui/material";

// Utilities
import { isMobile } from "../../../utilities/mobile-utilities";
import { genderList } from "../../../utilities/general-utilities";

// Formik
import { useFormikContext } from "formik";

// Navigate
import { useNavigate } from "react-router-dom";

// HOC
import withContextSaver from "../../../hoc/withContextSaver";

// Components
import CustomSelect from "../../general/CustomSelect";
import CustomDatePicker from "../../general/CustomDatePicker";

interface FieldObject {
	[key: string]: boolean;
}
interface PropsInterface {
	saveContext: (a: string, b: any) => void;
}

function PersonalInfoFields(props: PropsInterface) {
	const formik: any = useFormikContext();

	const navigate = useNavigate();

	const goBack = () => navigate("/sign-up/introduction");

	async function validateAndProceed() {
		let errorObject = await formik.validateForm();
		if (
			!errorObject.gender &&
			!errorObject.birthday &&
			!errorObject.employer &&
			!errorObject.profession &&
			!errorObject.defaultCurrency
		) {
			let { username, password, ...rest } = formik.values;
			props.saveContext("register-context", {
				username: "",
				password: "",
				...rest,
			});
			navigate("/sign-up/credentials");
		} else {
			let fieldsToTouch: FieldObject = {};
			for (let key of Object.keys(errorObject)) {
				if (
					[
						"gender",
						"birthday",
						"employer",
						"profession",
						"defaultCurrency",
					].includes(key)
				) {
					fieldsToTouch[key] = true;
				}
			}
			formik.setTouched(fieldsToTouch);
			formik.setErrors(errorObject);
		}
	}

	return (
		<>
			{/* Birthday */}
			<div className="mb-3">
				<CustomDatePicker fieldName="birthday" label="Birthday" />
			</div>
			{/* Gender */}
			<div className="mb-3">
				<CustomSelect options={genderList} fieldName="gender" label="Gender" />
			</div>
			{/* Profession */}
			<TextField
				sx={{ marginBottom: "12px" }}
				value={formik.values.profession}
				onBlur={formik.handleBlur}
				onChange={formik.handleChange}
				error={!!formik.errors.profession && formik.touched.profession}
				helperText={
					!!formik.errors.profession && formik.touched.profession
						? formik.errors.profession
						: " "
				}
				autoComplete="off"
				label="Profession"
				name="profession"
				size="small"
				fullWidth
			/>
			{/* Employer */}
			<TextField
				sx={{ marginBottom: "12px" }}
				value={formik.values.employer}
				onBlur={formik.handleBlur}
				onChange={formik.handleChange}
				error={!!formik.errors.employer && formik.touched.employer}
				helperText={
					!!formik.errors.employer && formik.touched.employer
						? formik.errors.employer
						: " "
				}
				autoComplete="off"
				label="Employer"
				name="employer"
				size="small"
				fullWidth
			/>
			<Stack
				className=" justify-end"
				direction="row"
				spacing={isMobile ? 1 : 4}
			>
				<Button onClick={goBack} variant="text" fullWidth={isMobile}>
					Go Back
				</Button>
				<Button
					endIcon={<ChevronRightOutlined />}
					onClick={validateAndProceed}
					variant="contained"
					fullWidth={isMobile}
				>
					Proceed
				</Button>
			</Stack>
		</>
	);
}

export default withContextSaver(PersonalInfoFields);
