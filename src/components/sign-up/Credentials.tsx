import { ChangeEvent, useEffect, useState } from "react";

// Formik
import { useFormikContext } from "formik";

// Icons
import { CelebrationOutlined } from "@mui/icons-material";

// MUI
import { Button, Stack, TextField, Typography } from "@mui/material";

// Components
import ValidationHint from "../general/ValidationHint";
import ToggleVisibility from "../general/ToggleVisibility";

// Validation
import { passwordRules, usernameRules } from "../../validators/credentials";

interface PropsInterface {
  changeStep: (a: number) => void;
}

interface MatchErrorInterface {
  show: boolean;
  message: string;
}

function Credentials(props: PropsInterface) {
  const formik: any = useFormikContext();

  const [repeatedPwd, setRepeatedPwd] = useState<string>("");
  const [matchError, setMatchError] = useState<MatchErrorInterface>({
    show: false,
    message: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showRepeatPwd, setShowRepeatPwd] = useState<boolean>(false);

  useEffect(() => {
    handlePwdBlur();
  }, [formik.values.password]);

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

  function handlePwdBlur() {
    if (repeatedPwd !== formik.values.password) {
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

  function validateAndRegister() {
    
  }

  return (
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
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        error={!!formik.errors.username && formik.touched.username}
        helperText={
          !!formik.errors.username && formik.touched.username
            ? formik.errors.username
            : " "
        }
        InputProps={{
          endAdornment: (
            <ValidationHint
              content={
                <ul className=" list-disc ml-3">
                  {usernameRules.map((rule) => (
                    <li key={rule}>{rule}.</li>
                  ))}
                </ul>
              }
            />
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
          endAdornment: (
            <Stack direction="row" className=" items-center" spacing={0.5}>
              <ToggleVisibility
                value={showPassword}
                onClick={toggleShowPassword}
              />
              <ValidationHint
                content={
                  <ul className=" list-disc ml-3">
                    {passwordRules.map((rule) => (
                      <li key={rule}>{rule}.</li>
                    ))}
                  </ul>
                }
              />
            </Stack>
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
          endAdornment: (
            <ToggleVisibility
              value={showRepeatPwd}
              onClick={toggleShowRepeatPwd}
            />
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
        <Button onClick={() => props.changeStep(-1)} variant="text">
          Go Back
        </Button>
        <Button
          endIcon={<CelebrationOutlined />}
          onClick={validateAndRegister}
          variant="contained"
        >
          Finish!
        </Button>
      </Stack>
    </Stack>
  );
}

export default Credentials;
