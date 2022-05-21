import { useEffect } from "react";

// Formik
import { Formik } from "formik";

// Validations
import { signUpSchema } from "../../../validators/credentials";

// Navigation
import { Outlet, useNavigate } from "react-router-dom";

// Custom Hooks
import useLocalContext from "../../../hooks/useLocalContext";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

// Redux
import { signUpUser } from "../../../features/auth/auth-slice";
import { useAppDispatch, useAppSelector } from "../../../redux_store/hooks";

interface FormikValues {
	birthday: string;
	employer: string;
	gender: string;
	name: string;
	password: string;
	profession: string;
	surname: string;
	username: string;
}

function SignUpForm() {
	const navigate = useNavigate();
	const axios = useAxiosPrivate();
	const dispatch = useAppDispatch();

	const token = useAppSelector((state) => state.auth.token);

	const [localContext] = useLocalContext("register-context", {
		// Step 1
		name: "",
		surname: "",
		// Step 2
		gender: "",
		birthday: null,
		employer: "",
		profession: "",
		// Step 3
		username: "",
		password: "",
	});

	async function handleUserSignUp(values: FormikValues) {
		let { username, password, ...personal } = values;
		try {
			await dispatch(
				signUpUser({
					axios,
					data: {
						username,
						password,
						personal,
					},
				})
			);
			localStorage.removeItem("register-context");
			navigate("/home/expenses", { replace: true });
		} catch (err) {
			console.error(err);
		}
	}

	return (
		<Formik
			initialValues={localContext}
			validationSchema={signUpSchema}
			onSubmit={(values: any) => handleUserSignUp(values)}
		>
			{(props) => (
				<form noValidate onSubmit={props.handleSubmit}>
					{/* All form stages */}
					<Outlet />
				</form>
			)}
		</Formik>
	);
}

export default SignUpForm;
