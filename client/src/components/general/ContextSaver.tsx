import { useEffect } from "react";

// Formik
import { useFormikContext } from "formik";

// Custom Hooks
import useLocalContext from "../../custom_hooks/useLocalContext";

interface PropsInterface {
  children: JSX.Element;
  contextKey: string;
}

function ContextSaver(props: PropsInterface) {
  const formik: any = useFormikContext();

  const [, persistContext] = useLocalContext(props.contextKey, formik.values);

  useEffect(() => {
    return () => {
      console.log(formik.values);
      persistContext(props.contextKey, formik.values);
    };
  }, []);

  useEffect(() => {
    console.log(formik.values);
  });

  return props.children;
}

export default ContextSaver;
