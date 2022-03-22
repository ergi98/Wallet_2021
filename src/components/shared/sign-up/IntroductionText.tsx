// MUI
import { Typography } from "@mui/material";

interface PropsInterface {
  text: string;
}

function IntroductionText(props: PropsInterface) {
  return (
    <>
      <Typography variant="subtitle1">Hi there, 👋🏼</Typography>
      <Typography
        className=" w-11/12 pb-3 whitespace-nowrap overflow-hidden text-ellipsis capitalize"
        variant="h4"
        gutterBottom
      >
        {props.text}
      </Typography>
    </>
  );
}

export default IntroductionText;
