// MUI
import { Card, CardContent } from "@mui/material";

// Formik
import { useFormikContext } from "formik";

// Components
import CredentialsText from "../../shared/sign-up/CredentialsText";
import CredentialsFields from "../../shared/sign-up/CredentialsFields";

function MobileCredentials() {
  const formik: any = useFormikContext();

  return (
    <>
      <CredentialsText className="text-neutral-50 px-3" name={formik.values.name} />
      <Card
        className="w-full rounded-t-3xl p-3 pt-8 pb-env h-fit"
        sx={{
          borderTopLeftRadius: "1.5rem",
          borderTopRightRadius: "1.5rem",
        }}
      >
        <CardContent children={<CredentialsFields />} />
      </Card>
    </>
  );
}

export default MobileCredentials;
