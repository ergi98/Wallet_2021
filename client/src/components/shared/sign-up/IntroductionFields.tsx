// Formik
import { useFormikContext } from "formik";

// MUI
import { Button, Stack, TextField } from "@mui/material";

// Icons
import { ChevronRightOutlined } from "@mui/icons-material";

// Navigation
import { useNavigate } from "react-router-dom";

// HOC
import withContextSaver from "../../../hoc/withContextSaver";

interface PropsInterface {
  saveContext: (a: string, b: any) => void;
}

interface FieldObject {
  [key: string]: boolean;
}

const isMobile = window.innerWidth <= 640;

function IntroductionFields(props: PropsInterface) {
  const navigate = useNavigate();
  const formik: any = useFormikContext();

  async function validateAndProceed() {
    let errorObject = await formik.validateForm();
    if (!errorObject["name"] && !errorObject["surname"]) {
      let { username, password, ...rest } = formik.values;
      props.saveContext("register-context", {
        username: "",
        password: "",
        ...rest,
      });
      navigate("/sign-up/personal-info");
    } else {
      let fieldsToTouch: FieldObject = {};
      for (let key of Object.keys(errorObject)) {
        if (["name", "surname"].includes(key)) {
          fieldsToTouch[key] = true;
        }
      }
      formik.setTouched(fieldsToTouch);
      formik.setErrors(errorObject);
    }
  }

  return (
    <>
      <Stack>
        <TextField
          sx={{ marginBottom: "12px" }}
          value={formik.values.name}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={!!formik.errors.name && formik.touched.name}
          helperText={
            !!formik.errors.name && formik.touched.name
              ? formik.errors.name
              : " "
          }
          spellCheck={false}
          label="First Name"
          autoComplete="off"
          autoCorrect="off"
          size="small"
          name="name"
          fullWidth
          required
        />
        <TextField
          sx={{ marginBottom: "12px" }}
          value={formik.values.surname}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={!!formik.errors.surname && formik.touched.surname}
          helperText={
            !!formik.errors.surname && formik.touched.surname
              ? formik.errors.surname
              : " "
          }
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          label="Last Name"
          name="surname"
          size="small"
          fullWidth
          required
        />
      </Stack>
      <Button
        endIcon={<ChevronRightOutlined />}
        onClick={validateAndProceed}
        fullWidth={isMobile}
        className="w-fit self-end"
        variant="contained"
      >
        Proceed
      </Button>
    </>
  );
}

export default withContextSaver(IntroductionFields);
