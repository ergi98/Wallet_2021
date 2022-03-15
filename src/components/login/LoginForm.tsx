import { useState } from "react";

// Formik
import { useFormik } from "formik";

// Validations
import { loginSchema } from "../../validators/credentials";

// Icons
import { LoginOutlined, PersonOutlineOutlined } from "@mui/icons-material";

// MUI
import {
  Grid,
  Button,
  Divider,
  TextField,
  InputAdornment,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

// Navigation
import { useNavigate } from "react-router-dom";
import ToggleVisibility from "../general/ToggleVisibility";

function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const navigateToSignUp = () => navigate("/sign-up/introduction");

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
        {/* Username */}
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
            fullWidth
            required
          />
        </Grid>
        {/* Password */}
        <Grid className="w-full" item>
          <TextField
            value={formik.values.password}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            error={!!formik.errors.password && formik.touched.password}
            type={showPassword ? "text" : "password"}
            helperText={
              !!formik.errors.password && formik.touched.password
                ? formik.errors.password
                : " "
            }
            label="Password"
            name="password"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ToggleVisibility
                    value={showPassword}
                    onClick={() => setShowPassword((prev) => !prev)}
                  />
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
        <Grid item>
          <Divider className="text-gray-500 w-48 text-[12px] pt-2">OR</Divider>
        </Grid>
        <Grid item>
          <Button
            onClick={navigateToSignUp}
            variant="text"
            sx={{
              color: "rgb(107 114 128)",
              fontSize: "12px",
            }}
          >
            Create an account
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default LoginForm;
