// Formik
import { Formik } from "formik";

// Validations
import { signUpSchema } from "../../../validators/credentials";

// Navigation
import { Outlet } from "react-router-dom";

// Custom Hooks
import useLocalContext from "../../../custom_hooks/useLocalContext";

function SignUpForm() {
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

  async function handleUserSignUp(values: Object, setSubmitting: Function) {
    // TODO: User sign up
    try {
      console.log("submitting");
      let dummyPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          reject("Smth happened");
        }, 1000);
      });
      await dummyPromise;
    } catch (err) {
      setSubmitting(false);
      // TODO: Display error if something goes wrong
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
