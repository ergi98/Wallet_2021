import { ChangeEvent, FocusEvent, useEffect, useState } from "react";

// Formik
import { useFormikContext } from "formik";

// Icons
import { CelebrationOutlined } from "@mui/icons-material";

// MUI
import {
  Grid,
  Stack,
  Button,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";

// Navigation
import { useNavigate } from "react-router-dom";

// Validation
import { passwordRules, usernameRules } from "../../validators/credentials";

// Components
import ExplainSection from "./ExplainSection";
import ValidationHint from "../general/ValidationHint";
import ToggleVisibility from "../general/ToggleVisibility";
interface MatchErrorInterface {
  show: boolean;
  message: string;
}

function Credentials() {
  const formik: any = useFormikContext();
  const navigate = useNavigate();

  const [repeatedPwd, setRepeatedPwd] = useState<string>("");
  const [matchError, setMatchError] = useState<MatchErrorInterface>({
    show: false,
    message: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showRepeatPwd, setShowRepeatPwd] = useState<boolean>(false);

  const [repeatPwdTouched, setRepeatPwdTouched] = useState<boolean>(false);

  useEffect(() => {
    checkForRepeatPwdErrors();
  }, [formik.values.password]);

  const navigateBack = () => navigate("/sign-up/personal-info");
  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const toggleShowRepeatPwd = () => setShowRepeatPwd((prev) => !prev);

  function handlePwdChange(event: ChangeEvent<HTMLInputElement>) {
    matchError.show &&
      setMatchError({
        show: false,
        message: "",
      });
    setRepeatedPwd(event.target.value);
  }

  function checkForRepeatPwdErrors(showError = false) {
    if (
      (repeatedPwd !== formik.values.password || !repeatedPwd) &&
      (repeatPwdTouched || showError)
    ) {
      setMatchError({
        show: true,
        message: "Passwords do not match!",
      });
    } else
      setMatchError({
        show: false,
        message: "",
      });
  }

  function handlePwdBlur() {
    setRepeatPwdTouched(true);
    checkForRepeatPwdErrors(true);
  }

  function handleSubmit() {
    checkForRepeatPwdErrors(true);
    formik.handleSubmit();
  }

  function validateUsernameAndHandleBlue(event: FocusEvent<HTMLInputElement>) {
    // formik.handleBlur(event);
  }

  return (
    <Grid container>
      <ExplainSection
        step={3}
        title="Credentials"
        paragraph="Try to pick a username you easily remember and a<strong> strong password </strong> so your data is safe."
      />
      <Grid xs={12} md={6} className="p-6" item>
        <Stack>
          {/* Birthday */}
          <Typography variant="subtitle1">
            Last step {formik.values.name}!
          </Typography>
          <Typography
            className=" w-11/12 pb-3 whitespace-nowrap overflow-hidden text-ellipsis"
            variant="h4"
            gutterBottom
          >
            Your credentials.
          </Typography>
          {/* Username */}
          <TextField
            sx={{ marginBottom: "12px" }}
            value={formik.values.username}
            onBlur={validateUsernameAndHandleBlue}
            onChange={formik.handleChange}
            error={!!formik.errors.username && formik.touched.username}
            helperText={
              !!formik.errors.username && formik.touched.username
                ? formik.errors.username
                : " "
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <ValidationHint
                    content={
                      <ul className=" list-disc ml-3">
                        {usernameRules.map((rule) => (
                          <li key={rule}>{rule}.</li>
                        ))}
                      </ul>
                    }
                  />
                </InputAdornment>
              ),
            }}
            spellCheck={false}
            autoCapitalize="none"
            autoComplete="off"
            label="Username"
            name="username"
            size="small"
            fullWidth
            required
          />
          {/* Password */}
          <TextField
            sx={{ marginBottom: "12px" }}
            value={formik.values.password}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            error={!!formik.errors.password && formik.touched.password}
            helperText={
              !!formik.errors.password && formik.touched.password
                ? formik.errors.password
                : " "
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ToggleVisibility
                    value={showPassword}
                    onClick={toggleShowPassword}
                  />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <ValidationHint
                    content={
                      <ul className=" list-disc ml-3">
                        {passwordRules.map((rule) => (
                          <li key={rule}>{rule}.</li>
                        ))}
                      </ul>
                    }
                  />
                </InputAdornment>
              ),
            }}
            type={showPassword ? "text" : "password"}
            spellCheck={false}
            autoCapitalize="none"
            autoComplete="off"
            label="Password"
            name="password"
            size="small"
            required
            fullWidth
          />
          {/* Confirm Password */}
          <TextField
            sx={{ marginBottom: "12px" }}
            value={repeatedPwd}
            onBlur={handlePwdBlur}
            onChange={handlePwdChange}
            error={matchError.show}
            helperText={!!matchError.show ? matchError.message : " "}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ToggleVisibility
                    value={showRepeatPwd}
                    onClick={toggleShowRepeatPwd}
                  />
                </InputAdornment>
              ),
            }}
            type={showRepeatPwd ? "text" : "password"}
            spellCheck={false}
            label="Confirm Password"
            name="confirm-password"
            autoCapitalize="none"
            autoComplete="off"
            size="small"
            required
            fullWidth
          />
          <Stack className=" justify-end" direction="row" spacing={4}>
            <Button onClick={navigateBack} variant="text">
              Go Back
            </Button>
            <Button
              onClick={handleSubmit}
              endIcon={<CelebrationOutlined />}
              variant="contained"
              type="submit"
            >
              Finish!
            </Button>
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
}

export default Credentials;
