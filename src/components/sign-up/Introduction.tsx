// Formik
import { useFormikContext } from "formik";

// Utilities
import { isObjectEmpty } from "../../utilities/general-utilities";

// Mui
import { Button, Grid, TextField } from "@mui/material";
import { ChevronRightOutlined, PersonRounded } from "@mui/icons-material";

interface PropsInterface {
  changeStep: (a: number) => void;
}

interface FieldObject {
  [key: string]: boolean;
}

function Introduction(props: PropsInterface) {
  const formik: any = useFormikContext();

  async function validateAndProceed() {
    let errorObject = await formik.validateForm();
    if (isObjectEmpty(errorObject)) {
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

  return (
    <Grid direction="column" alignItems="center" container>
      <Grid className="pb-8" item>
        <PersonRounded sx={{ color: "#1e3b8b", fontSize: "72px" }} />
      </Grid>
      <Grid className="w-full pb-1 sm:w-80" item>
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
      <Grid className="w-full pb-12 sm:w-80" item>
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
