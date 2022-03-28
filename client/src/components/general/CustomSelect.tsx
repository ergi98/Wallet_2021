import { useState } from "react";

// Formik
import { useFormikContext } from "formik";

// MUI
import {
  FormHelperText,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

interface SelectOption {
  text: String;
  value: String;
}

interface PropsInterface {
  options?: Array<SelectOption>;
  fieldName: string;
  label: string;
  required?: boolean;
}

function CustomSelect({ fieldName, label, options, required }: PropsInterface) {
  const [selectOptions, setSelectOptions] = useState<Array<any>>(
    () => options || []
  );

  const formik: any = useFormikContext();

  return (
    <TextField
      label={label}
      name={fieldName}
      value={formik.values[fieldName]}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={!!formik.errors[fieldName] && formik.touched[fieldName]}
      helperText={
        !!formik.errors[fieldName] && formik.touched[fieldName]
          ? formik.errors[fieldName]
          : " "
      }
      required={required}
      autoComplete="off"
      size="small"
      fullWidth
      select
    >
      {selectOptions.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.text}
        </MenuItem>
      ))}
    </TextField>
  );
}

export default CustomSelect;
