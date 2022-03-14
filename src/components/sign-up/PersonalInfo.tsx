import { useEffect } from "react";

// Custom Hooks
import useLocalContext from "../../custom_hooks/useLocalContext";

// Validations
import { personalInfoSchema } from "../../validators/credentials";

// Formik
import { useFormikContext } from "formik";

// MUI
import { ChevronRightOutlined } from "@mui/icons-material";
import { Button, Grid, Stack, TextField, Typography } from "@mui/material";

// Utilities
import { genderList } from "../../utilities/general-utilities";

// Components
import CustomSelect from "../general/CustomSelect";
import CustomDatePicker from "../general/CustomDatePicker";
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
  });

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
    <Stack>
      {/* Birthday */}
      <Typography variant="subtitle1">Alright {formik.values.name},</Typography>
      <Typography
        className=" w-11/12 pb-3 whitespace-nowrap overflow-hidden text-ellipsis"
        variant="h4"
        gutterBottom
      >
        Who are you?
      </Typography>
      {/* Birthday */}
      <div className="mb-3">
        <CustomDatePicker fieldName="birthday" label="Birthday" />
      </div>
      {/* Gender */}
      <div className="mb-3">
        <CustomSelect options={genderList} fieldName="gender" label="Gender" />
      </div>
      {/* Profession */}
      <TextField
        sx={{ marginBottom: "12px" }}
        value={formik.values.profession}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        error={!!formik.errors.profession && formik.touched.profession}
        helperText={
          !!formik.errors.profession && formik.touched.profession
            ? formik.errors.profession
            : " "
        }
        autoComplete="off"
        label="Profession"
        name="profession"
        size="small"
        fullWidth
      />
      {/* Employer */}
      <TextField
        sx={{ marginBottom: "12px" }}
        value={formik.values.employer}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        error={!!formik.errors.employer && formik.touched.employer}
        helperText={
          !!formik.errors.employer && formik.touched.employer
            ? formik.errors.employer
            : " "
        }
        autoComplete="off"
        label="Employer"
        name="employer"
        size="small"
        fullWidth
      />
      <Stack className=" justify-end" direction="row" spacing={4}>
        <Button onClick={goBack} variant="text">
          Go Back
        </Button>
        <Button
          endIcon={<ChevronRightOutlined />}
          onClick={validateAndProceed}
          variant="contained"
        >
          Proceed
        </Button>
      </Stack>
    </Stack>
  );
}

export default PersonalInfo;
