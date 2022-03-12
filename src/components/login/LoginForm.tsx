import { useState } from "react";

// Formik
import { useFormik } from "formik";

// Validations
import { loginSchema } from "../../validators/credentials";

// Icons
import {
  LockOutlined,
  LoginOutlined,
  PersonOutlineOutlined,
} from "@mui/icons-material";

// MUI
import { TextField, Grid, InputAdornment } from "@mui/material";
import { LoadingButton } from "@mui/lab";

function LoginForm() {
  const formik = useFormik({
    initialValues: { username: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: (values, { setSubmitting }) =>
      handleUserLogin(values, setSubmitting),
  });

  async function handleUserLogin(values: Object, setSubmitting: Function) {
    // TODO: User login
    try {
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
    <form noValidate onSubmit={formik.handleSubmit}>
      <Grid rowGap={2} direction="column" alignItems="center" container>
        <Grid className="w-full" item>
          <TextField
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={!!formik.errors.username && formik.touched.username}
            helperText={
              !!formik.errors.username && formik.touched.username
                ? formik.errors.username
                : " "
            }
            label="Username"
            name="username"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineOutlined />
                </InputAdornment>
              ),
            }}
            autoFocus
            fullWidth
            required
          />
        </Grid>
        <Grid className="w-full" item>
          <TextField
            value={formik.values.password}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            error={!!formik.errors.password && formik.touched.password}
            helperText={
              !!formik.errors.password && formik.touched.password
                ? formik.errors.password
                : " "
            }
            label="Password"
            name="password"
            type="password"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined />
                </InputAdornment>
              ),
            }}
            fullWidth
            required
          />
        </Grid>
        <Grid item>
          <LoadingButton
            type="submit"
            loading={formik.isSubmitting}
            endIcon={<LoginOutlined />}
            aria-label="login"
            variant="contained"
            loadingPosition="end"
          >
            Login
          </LoadingButton>
        </Grid>
      </Grid>
    </form>
  );
}

export default LoginForm;
