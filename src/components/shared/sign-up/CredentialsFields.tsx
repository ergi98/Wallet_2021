import { ChangeEvent, FocusEvent, useEffect, useState } from "react";

// MUI
import { LoadingButton } from "@mui/lab";
import { Button, InputAdornment, Stack, TextField } from "@mui/material";

// Icons
import { CelebrationOutlined } from "@mui/icons-material";

// Rules
import { passwordRules, usernameRules } from "../../../validators/credentials";

// Formik
import { useFormikContext } from "formik";

// Navigation
import { useNavigate } from "react-router-dom";

// Components
import ValidationHint from "../../general/ValidationHint";
import ToggleVisibility from "../../general/ToggleVisibility";

interface MatchErrorInterface {
  show: boolean;
  message: string;
}

const isMobile = window.innerWidth <= 640;

function CredentialsFields() {
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
      return true;
    } else {
      setMatchError({
        show: false,
        message: "",
      });
      return false;
    }
  }

  function handlePwdBlur() {
    setRepeatPwdTouched(true);
    checkForRepeatPwdErrors(true);
  }

  function handleSubmit() {
    let hasErrors = checkForRepeatPwdErrors(true);
    !hasErrors && formik.handleSubmit();
  }

  function validateUsernameAndHandleBlue(event: FocusEvent<HTMLInputElement>) {
    // TODO: Make API call to check if the given username is taken or not
    formik.handleBlur(event);
  }

  return (
    <>
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
      <Stack
        className=" justify-end"
        direction="row"
        spacing={isMobile ? 1 : 4}
      >
        <Button
          onClick={navigateBack}
          disabled={formik.isSubmitting}
          fullWidth={isMobile}
          variant="text"
        >
          Go Back
        </Button>
        <LoadingButton
          fullWidth={isMobile}
          onClick={handleSubmit}
          loading={formik.isSubmitting}
          endIcon={<CelebrationOutlined />}
          aria-label="sign-up"
          variant="contained"
        >
          Finish!
        </LoadingButton>
      </Stack>
    </>
  );
}

export default CredentialsFields;
