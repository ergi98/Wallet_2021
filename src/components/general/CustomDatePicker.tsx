import React from "react";

// Formik
import { useFormikContext } from "formik";

// MUI
import { DesktopDatePicker } from "@mui/lab";
import { TextField } from "@mui/material";

// Utilities
import { isValidDate } from "../../utilities/date-utilities";

interface PropsInterface {
  required?: boolean;
  fieldName: string;
  label: string;
}
function CustomDatePicker({ fieldName, label, required }: PropsInterface) {
  const formik: any = useFormikContext();

  function handleChange(inputValue: any) {
    let fieldValue: any = "";
    if (isValidDate(inputValue)) {
      fieldValue = inputValue;
    }
    formik.setFieldValue(fieldName, fieldValue);
  }

  return (
    <DesktopDatePicker
      label={label}
      inputFormat="dd/MM/yyyy"
      value={formik.values[fieldName]}
      onChange={handleChange}
      renderInput={(params) => (
        <TextField
          {...params}
          name={fieldName}
          onBlur={formik.handleBlur}
          error={!!formik.errors[fieldName] && formik.touched[fieldName]}
          helperText={
            !!formik.errors[fieldName] && formik.touched[fieldName]
              ? formik.errors[fieldName]
              : " "
          }
          autoComplete="off"
          required={required}
          spellCheck={false}
          autoCapitalize="none"
          autoCorrect="off"
          type="number"
          size="small"
          fullWidth
        />
      )}
    />
  );
}

export default CustomDatePicker;
