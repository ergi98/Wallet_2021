import { useMemo } from "react";

// MUI
import { Typography } from "@mui/material";

// Utilities
import { isStringEmpty } from "../../../utilities/general-utilities";

interface PropsInterface {
  name: string;
  surname: string;
}

function IntroductionText(props: PropsInterface) {
  const fullName = useMemo(() => {
    let value = "";
    let name = props.name?.trim();
    let surname = props.surname?.trim();
    if (isStringEmpty(name) && isStringEmpty(surname)) value = "...";
    else value = `${name} ${surname}!`;
    return value;
  }, [props.name, props.surname]);

  return (
    <>
      <Typography variant="subtitle1">Hi there, 👋🏼</Typography>
      <Typography
        className=" w-11/12 pb-3 whitespace-nowrap overflow-hidden text-ellipsis capitalize"
        variant="h4"
        gutterBottom
      >
        {fullName}
      </Typography>
    </>
  );
}

export default IntroductionText;
