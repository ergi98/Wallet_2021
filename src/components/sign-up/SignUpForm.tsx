// Formik
import { Formik } from "formik";

// Animation
// import { motion } from "framer-motion";

// Validations
import { signUpSchema } from "../../validators/credentials";

// Navigation
import { Outlet } from "react-router-dom";

// Custom Hooks
import useLocalContext from "../../custom_hooks/useLocalContext";

// Components
import ContextSaver from "../general/ContextSaver";
import { useEffect } from "react";

function SignUpForm() {
  const [localContext, persistContext] = useLocalContext("register-context", {
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
      {/* All form stages */}
      <Outlet />
    </Formik>
  );
}

export default SignUpForm;
