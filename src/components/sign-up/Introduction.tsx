import { useEffect, useMemo } from "react";

// Formik
import { useFormikContext } from "formik";

// Utilities
import { isStringEmpty } from "../../utilities/general-utilities";

// Custom Hooks
import useLocalContext from "../../custom_hooks/useLocalContext";

// Validations
import { introductionSchema } from "../../validators/credentials";

// Mui
import { Button, Stack, TextField, Typography } from "@mui/material";

// Icons
import { ChevronRightOutlined } from "@mui/icons-material";

interface PropsInterface {
  changeStep: (a: number) => void;
}

interface FieldObject {
  [key: string]: boolean;
}

function Introduction(props: PropsInterface) {
  const formik: any = useFormikContext();

  const [localContext, persistContext] = useLocalContext("introduction", {
    name: "",
    surname: "",
  });

  useEffect(() => {
    function populateFromContext(context: Object) {
      introductionSchema.validate(context).then((res) => {
        formik.setValues(res);
      });
    }
    populateFromContext(localContext);
  }, []);

  async function validateAndProceed() {
    let errorObject = await formik.validateForm();
    if (!errorObject["name"] && !errorObject["surname"]) {
      persistContext("introduction", {
        name: formik.values.name?.trim(),
        surname: formik.values.surname?.trim(),
      });
      props.changeStep(1);
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

  const fullName = useMemo(() => {
    let value = "";
    let name = formik.values.name?.trim();
    let surname = formik.values.surname?.trim();
    if (isStringEmpty(name) && isStringEmpty(surname)) value = "...";
    else value = `${name} ${surname}!`;
    return value;
  }, [formik.values.name, formik.values.surname]);

  return (
    <Stack rowGap={2}>
      <div>
        <Typography variant="subtitle1">Hi there, 👋🏼</Typography>
        <Typography
          className=" w-11/12 pb-3 whitespace-nowrap overflow-hidden text-ellipsis capitalize"
          variant="h4"
          gutterBottom
        >
          {fullName}
        </Typography>
      </div>
      <div>
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
          autoComplete="off"
          spellCheck={false}
          autoCorrect="off"
          label="First Name"
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
          autoCorrect="off"
          autoComplete="off"
          label="Last Name"
          name="surname"
          size="small"
          fullWidth
          required
        />
      </div>
      <Button
        onClick={validateAndProceed}
        endIcon={<ChevronRightOutlined />}
        variant="contained"
        className="w-fit self-end"
      >
        Proceed
      </Button>
    </Stack>
  );
}

export default Introduction;
