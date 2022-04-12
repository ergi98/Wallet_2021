// Formik
import { Formik } from "formik";

// Validations
import { signUpSchema } from "../../../validators/credentials";

// Navigation
import { Outlet, useNavigate } from "react-router-dom";

// Custom Hooks
import useAuth from "../../../hooks/useAuth";
import useTryCatch from "../../../hooks/useTryCatch";
import useLocalContext from "../../../hooks/useLocalContext";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

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
	const tryCatch = useTryCatch();
	const axios = useAxiosPrivate();

	const { setAuthState } = useAuth();

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

	async function handleUserSignUp(
		values: FormikValues,
		setSubmitting: Function
	) {
		setSubmitting(true);
		let { username, password, ...personal } = values;
		let { data } = await tryCatch(
			axios.post("/auth/sign-up", {
				username,
				password,
				personal,
			})
		);
		setSubmitting(false);

		if (data) {
			setAuthState &&
				setAuthState({
					token: data.data.token,
					isAuthenticated: true,
				});
			localStorage.removeItem("register-context");
			navigate("/home/expenses", { replace: true });
		}
	}

	return (
		<Formik
			initialValues={localContext}
			validationSchema={signUpSchema}
			onSubmit={(values: any, { setSubmitting }: any) =>
				handleUserSignUp(values, setSubmitting)
			}
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
