// Formik
import { useFormikContext } from "formik";

// MUI
import { Card, CardContent } from "@mui/material";

// Components
import PersonalInfoText from "../../shared/sign-up/PersonalInfoText";
import PersonalInfoFields from "../../shared/sign-up/PersonalInfoFields";

function MobilePersonalInfo() {
  const formik: any = useFormikContext();

  return (
    <>
      <PersonalInfoText
        className="text-neutral-50 px-3"
        name={formik.values.name}
      />
      <Card
        className="w-full rounded-t-3xl p-3 pt-8 pb-env h-fit"
        sx={{
          borderTopLeftRadius: "1.5rem",
          borderTopRightRadius: "1.5rem",
        }}
      >
        <CardContent children={<PersonalInfoFields />} />
      </Card>
    </>
  );
}

export default MobilePersonalInfo;
