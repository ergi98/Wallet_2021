import { useState } from "react";

// Formik
import { useFormik } from "formik";

// Validations
import {
	loginSchema,
	passwordRules,
	usernameRules,
} from "../../../validators/credentials";

// Icons
import { LoginOutlined, PersonOutlineOutlined } from "@mui/icons-material";

// MUI
import {
	Grid,
	Button,
	Divider,
	TextField,
	InputAdornment,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

// Navigation
import { useNavigate } from "react-router-dom";

// Components
import ValidationHint from "../../general/ValidationHint";
import ToggleVisibility from "../../general/ToggleVisibility";

// Hooks
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

// Redux
import { loginUser } from "../../../features/auth/auth-slice";
import { useAppDispatch, useAppSelector } from "../../../redux_store/hooks";

interface LogInData {
	username: string;
	password: string;
}

function LoginForm() {
	const navigate = useNavigate();
	const axios = useAxiosPrivate();
	const dispatch = useAppDispatch();

	const [showPassword, setShowPassword] = useState<boolean>(false);

	const token = useAppSelector((state) => state.auth.token);
	const loading = useAppSelector((state) => state.auth.loading);

	const navigateToSignUp = () => navigate("/sign-up/introduction");

	const formik = useFormik({
		initialValues: { username: "", password: "" },
		validationSchema: loginSchema,
		onSubmit: (values) => handleUserLogin(values),
	});

	async function handleUserLogin(values: LogInData) {
		try {
			await dispatch(loginUser({ axios, data: values })).unwrap();
			navigate("/home/expenses", { replace: true });
		} catch (err) {
			console.error(err);
		}
	}

	return (
		<form noValidate onSubmit={formik.handleSubmit}>
			<Grid rowGap={2} direction="column" alignItems="center" container>
				{/* Username */}
				<Grid className="w-full" item>
					<TextField
						value={formik.values.username}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						error={!!formik.errors.username && formik.touched.username}
						helperText={
							!!formik.errors.username && formik.touched.username
								? formik.errors.username
								: " "
						}
						spellCheck={false}
						autoCapitalize="none"
						autoCorrect="off"
						label="Username"
						name="username"
						size="small"
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<PersonOutlineOutlined />
								</InputAdornment>
							),
							endAdornment: (
								<InputAdornment position="end">
									<ValidationHint
										content={
											<ul className=" list-disc ml-3">
												{usernameRules.map((rule) => (
													<li key={rule}>{rule}.</li>
												))}
											</ul>
										}
									/>
								</InputAdornment>
							),
						}}
						fullWidth
						required
					/>
				</Grid>
				{/* Password */}
				<Grid className="w-full" item>
					<TextField
						value={formik.values.password}
						onBlur={formik.handleBlur}
						onChange={formik.handleChange}
						error={!!formik.errors.password && formik.touched.password}
						type={showPassword ? "text" : "password"}
						helperText={
							!!formik.errors.password && formik.touched.password
								? formik.errors.password
								: " "
						}
						spellCheck={false}
						autoCapitalize="none"
						autoCorrect="off"
						label="Password"
						name="password"
						size="small"
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<ToggleVisibility
										value={showPassword}
										onClick={() => setShowPassword((prev) => !prev)}
									/>
								</InputAdornment>
							),
							endAdornment: (
								<InputAdornment position="end">
									<ValidationHint
										content={
											<ul className=" list-disc ml-3">
												{passwordRules.map((rule) => (
													<li key={rule}>{rule}.</li>
												))}
											</ul>
										}
									/>
								</InputAdornment>
							),
						}}
						fullWidth
						required
					/>
				</Grid>
				<Grid item>
					<LoadingButton
						type="submit"
						loading={loading}
						endIcon={<LoginOutlined />}
						aria-label="login"
						variant="contained"
						loadingPosition="end"
					>
						Login
					</LoadingButton>
				</Grid>
				<Grid item>
					<Divider className="text-gray-500 w-48 text-[12px] pt-2">OR</Divider>
				</Grid>
				<Grid item>
					<Button
						onClick={navigateToSignUp}
						variant="text"
						sx={{
							color: "rgb(107 114 128)",
							fontSize: "12px",
						}}
					>
						Create an account
					</Button>
				</Grid>
			</Grid>
		</form>
	);
}

export default LoginForm;
