// Formik
import { Card, CardContent, Paper } from "@mui/material";

// Formik
import { useFormikContext } from "formik";

// Components
import IntroductionText from "../../shared/sign-up/IntroductionText";
import IntroductionFields from "../../shared/sign-up/IntroductionFields";

function MobileIntroduction() {
  const formik: any = useFormikContext();

  return (
    <>
      <IntroductionText
        className="text-white px-3"
        name={formik.values.name}
        surname={formik.values.surname}
      />
      <Card
        className="w-full rounded-t-3xl p-3 pt-8 pb-env h-fit"
        sx={{
          borderTopLeftRadius: "1.5rem",
          borderTopRightRadius: "1.5rem",
        }}
      >
        <CardContent children={<IntroductionFields />} />
      </Card>
    </>
  );
}

export default MobileIntroduction;
