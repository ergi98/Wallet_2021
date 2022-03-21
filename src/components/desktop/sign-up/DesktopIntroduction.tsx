import { useMemo } from "react";

// Formik
import { useFormikContext } from "formik";

// Utilities
import { isStringEmpty } from "../../../utilities/general-utilities";

// Mui
import { Button, Grid, Stack, TextField, Typography } from "@mui/material";

// Icons
import { ChevronRightOutlined } from "@mui/icons-material";

// Components
import ExplainSection from "./DesktopExplainSection";

// HOC
import withContextSaver from "../../../hoc/withContextSaver";

// Navigate
import { useNavigate } from "react-router-dom";

// Animation
import { motion } from "framer-motion";

interface FieldObject {
  [key: string]: boolean;
}

interface PropsInterface {
  saveContext: (a: string, b: any) => void;
}

function DesktopIntroduction(props: PropsInterface) {
  const formik: any = useFormikContext();

  const navigate = useNavigate();

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

  const fullName = useMemo(() => {
    let value = "";
    let name = formik.values.name?.trim();
    let surname = formik.values.surname?.trim();
    if (isStringEmpty(name) && isStringEmpty(surname)) value = "...";
    else value = `${name} ${surname}!`;
    return value;
  }, [formik.values.name, formik.values.surname]);

  return (
    <Grid container>
      <ExplainSection
        step={1}
        title="What should we call you?"
        subtitle="Welcome to your account setup."
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
        </motion.div>
      </Grid>
    </Grid>
  );
}

export default withContextSaver(DesktopIntroduction);
