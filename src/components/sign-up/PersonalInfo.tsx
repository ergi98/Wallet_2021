import { useEffect } from "react";

// Custom Hooks
import useLocalContext from "../../custom_hooks/useLocalContext";

// Validations
import { personalInfoSchema } from "../../validators/credentials";

// Formik
import { useFormikContext } from "formik";

// Utilities
import { isObjectEmpty } from "../../utilities/general-utilities";

// MUI
import { Button, Grid, TextField, Typography } from "@mui/material";
import CustomDatePicker from "../general/CustomDatePicker";
import CustomSelect from "../general/CustomSelect";
import { ChevronRightOutlined } from "@mui/icons-material";

// Components
interface PropsInterface {
  changeStep: (a: number) => void;
}
interface FieldObject {
  [key: string]: boolean;
}

function PersonalInfo(props: PropsInterface) {
  const formik: any = useFormikContext();

  const [localContext, persistContext] = useLocalContext("personal-info", {
    gender: "",
    birthday: null,
    employer: "",
    profession: "",
    defaultCurrency: "",
  });

  // TODO: Fetch from API
  const currencyList = [
    { text: "Albanian Lek", value: "ALL" },
    { text: "Euro", value: "EUR" },
    { text: "United States Dollar", value: "USD" },
    { text: "Pound Sterling", value: "GBP" },
    { text: "Australian Dollar", value: "AUD" },
  ];
  const genderList = [
    { text: "Male", value: "M" },
    { text: "Female", value: "F" },
    { text: "Transgender", value: "TG" },
    { text: "Non-binary/non-conforming", value: "NB/C" },
  ];

  useEffect(() => {
    function populateFromContext(context: Object) {
      personalInfoSchema.validate(context).then((res) => {
        formik.setValues(res);
      });
    }
    console.log(localContext);
    populateFromContext(localContext);
  }, []);

  function goBack() {
    persistContext("personal-info", {
      gender: formik.values.gender,
      birthday: formik.values.birthday,
      employer: formik.values.employer?.trim(),
      profession: formik.values.profession?.trim(),
      defaultCurrency: formik.values.defaultCurrency,
    });
    props.changeStep(-1);
  }

  async function validateAndProceed() {
    let errorObject = await formik.validateForm();
    if (
      !errorObject.gender &&
      !errorObject.birthday &&
      !errorObject.employer &&
      !errorObject.profession &&
      !errorObject.defaultCurrency
    ) {
      persistContext("personal-info", {
        gender: formik.values.gender,
        birthday: formik.values.birthday,
        employer: formik.values.employer?.trim(),
        profession: formik.values.profession?.trim(),
        defaultCurrency: formik.values.defaultCurrency,
      });
      props.changeStep(1);
    } else {
      let fieldsToTouch: FieldObject = {};
      for (let key of Object.keys(errorObject)) {
        if (
          [
            "gender",
            "birthday",
            "employer",
            "profession",
            "defaultCurrency",
          ].includes(key)
        ) {
          fieldsToTouch[key] = true;
        }
      }
      formik.setTouched(fieldsToTouch);
      formik.setErrors(errorObject);
    }
  }

  return (
    <Grid className="pt-8" rowSpacing={1} columnSpacing={2} container>
      {/* Default Currency */}
      <Grid xs={12} item>
        <CustomSelect
          options={currencyList}
          fieldName="defaultCurrency"
          label="Preferred Currency"
          required={true}
        />
      </Grid>
      {/* Birthday */}
      <Grid xs={8} item>
        <CustomDatePicker fieldName="birthday" label="Birthday" />
      </Grid>
      {/* Gender */}
      <Grid xs={4} item>
        <CustomSelect options={genderList} fieldName="gender" label="Gender" />
      </Grid>
      {/* Profession */}
      <Grid xs={12} item>
        <TextField
          value={formik.values.profession}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={!!formik.errors.profession && formik.touched.profession}
          helperText={
            !!formik.errors.profession && formik.touched.profession
              ? formik.errors.profession
              : " "
          }
          label="Profession"
          name="profession"
          size="small"
          fullWidth
        />
      </Grid>
      {/* Employer */}
      <Grid xs={12} item>
        <TextField
          value={formik.values.employer}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={!!formik.errors.employer && formik.touched.employer}
          helperText={
            !!formik.errors.employer && formik.touched.employer
              ? formik.errors.employer
              : " "
          }
          label="Employer"
          name="employer"
          size="small"
          fullWidth
        />
      </Grid>
      <Grid sx={{ marginLeft: "auto" }} item>
        <Button sx={{ marginRight: "8px" }} onClick={goBack} variant="text">
          Go Back
        </Button>
        <Button
          endIcon={<ChevronRightOutlined />}
          onClick={validateAndProceed}
          variant="contained"
        >
          Proceed
        </Button>
      </Grid>
    </Grid>
  );
}

export default PersonalInfo;
