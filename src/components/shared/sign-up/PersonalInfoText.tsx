// MUI
import { Typography } from "@mui/material";

interface PropsInterface {
  name: string;
  className?: string;
}

function PersonalInfoText(props: PropsInterface) {
  return (
    <>
      <Typography className={props.className} variant="subtitle1">
        Alright {props.name},
      </Typography>
      <Typography
        className={`w-11/12 pb-3 whitespace-nowrap overflow-hidden text-ellipsis ${props.className}`}
        variant="h4"
        gutterBottom
      >
        Who are you?
      </Typography>
    </>
  );
}

export default PersonalInfoText;
