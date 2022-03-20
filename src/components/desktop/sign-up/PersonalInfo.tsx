// Navigation
import { useNavigate } from "react-router-dom";

// Formik
import { useFormikContext } from "formik";

// Icons
import { ChevronRightOutlined } from "@mui/icons-material";

// MUI
import { Button, Grid, Stack, TextField, Typography } from "@mui/material";

// Utilities
import { genderList } from "../../../utilities/general-utilities";

// Animation
import { motion } from "framer-motion";

// Components
import ExplainSection from "./ExplainSection";
import CustomSelect from "../../general/CustomSelect";
import CustomDatePicker from "../../general/CustomDatePicker";

// HOC
import withContextSaver from "../../../hoc/withContextSaver";

interface FieldObject {
  [key: string]: boolean;
}
interface PropsInterface {
  saveContext: (a: string, b: any) => void;
}

function PersonalInfo(props: PropsInterface) {
  const formik: any = useFormikContext();

  const navigate = useNavigate();

  const goBack = () => navigate("/sign-up/introduction");

  async function validateAndProceed() {
    let errorObject = await formik.validateForm();
    if (
      !errorObject.gender &&
      !errorObject.birthday &&
      !errorObject.employer &&
      !errorObject.profession &&
      !errorObject.defaultCurrency
    ) {
      let { username, password, ...rest } = formik.values;
      props.saveContext("register-context", {
        username: "",
        password: "",
        ...rest,
      });
      navigate("/sign-up/credentials");
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
    <Grid container>
      <ExplainSection
        step={2}
        title={`Lets get to know you ${formik.values.name?.trim()}.`}
        paragraph="Tell us a little bit more about yourself and what you do."
      />
      <Grid xs={12} md={6} className="p-6" item>
        <motion.div
          initial={{ opacity: 0, x: 5 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 5 }}
          transition={{
            type: "spring",
            bounce: 0,
          }}
        >
          <Stack>
            {/* Birthday */}
            <Typography variant="subtitle1">
              Alright {formik.values.name},
            </Typography>
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
              <CustomSelect
                options={genderList}
                fieldName="gender"
                label="Gender"
              />
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
        </motion.div>
      </Grid>
    </Grid>
  );
}

export default withContextSaver(PersonalInfo);
