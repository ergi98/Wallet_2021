// Formik
import { useFormikContext } from "formik";

// Utilities
import {
  isObjectEmpty,
  isEmptyString,
} from "../../utilities/general-utilities";

// Mui
import { Button, Grid, TextField, Typography } from "@mui/material";
import { ChevronRightOutlined } from "@mui/icons-material";
import { useEffect, useMemo } from "react";
import useLocalContext from "../../custom_hooks/useLocalContext";
import { introductionSchema } from "../../validators/credentials";

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
    if (isObjectEmpty(errorObject)) {
      persistContext("introduction", {
        name: formik.values.name?.trim(),
        surname: formik.values.surname?.trim(),
      });
      props.changeStep(1);
    } else {
      let fieldsToTouch: FieldObject = {};
      for (let key of Object.keys(errorObject)) {
        fieldsToTouch[key] = true;
      }
      formik.setTouched(fieldsToTouch);
      formik.setErrors(errorObject);
    }
  }

  const fullName = useMemo(() => {
    let value = "";
    let name = formik.values.name?.trim();
    let surname = formik.values.surname?.trim();
    if (isEmptyString(name) && isEmptyString(surname)) value = "...";
    else value = `${name} ${surname}!`;
    return value;
  }, [formik.values.name, formik.values.surname]);

  return (
    <Grid direction="column" alignItems="center" container>
      <Grid alignSelf="start" item>
        <Typography variant="subtitle1">Hi there, 👋🏼</Typography>
      </Grid>
      <Grid className="pb-8" alignSelf="start" item>
        <Typography
          className=" w-11/12 md:w-80 whitespace-nowrap overflow-hidden text-ellipsis capitalize"
          variant="h4"
          gutterBottom
        >
          {fullName}
        </Typography>
      </Grid>
      <Grid className="w-full pb-1" item>
        <TextField
          value={formik.values.name}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={!!formik.errors.name && formik.touched.name}
          helperText={
            !!formik.errors.name && formik.touched.name
              ? formik.errors.name
              : " "
          }
          label="First Name"
          size="small"
          name="name"
          fullWidth
          required
        />
      </Grid>
      <Grid className="w-full pb-12" item>
        <TextField
          value={formik.values.surname}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={!!formik.errors.surname && formik.touched.surname}
          helperText={
            !!formik.errors.surname && formik.touched.surname
              ? formik.errors.surname
              : " "
          }
          label="Last Name"
          name="surname"
          size="small"
          fullWidth
          required
        />
      </Grid>
      <Grid className="w-full" item>
        <div className="flex justify-end">
          <Button
            onClick={validateAndProceed}
            endIcon={<ChevronRightOutlined />}
            variant="contained"
            className="w-fit"
          >
            Proceed
          </Button>
        </div>
      </Grid>
    </Grid>
  );
}

export default Introduction;
