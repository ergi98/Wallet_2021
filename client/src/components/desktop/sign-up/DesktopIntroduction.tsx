// Formik
import { useFormikContext } from "formik";

// Mui
import { Grid, Stack } from "@mui/material";

// HOC
import withContextSaver from "../../../hoc/withContextSaver";

// Animation
import { motion } from "framer-motion";

// Components
import ExplainSection from "./DesktopExplainSection";
import IntroductionText from "../../shared/sign-up/IntroductionText";
import IntroductionFields from "../../shared/sign-up/IntroductionFields";

interface PropsInterface {
  saveContext: (a: string, b: any) => void;
}

function DesktopIntroduction(props: PropsInterface) {
  const formik: any = useFormikContext();

  return (
    <Grid container>
      <ExplainSection
        step={1}
        title="What should we call you?"
        subtitle="Welcome to your account setup."
      />
      <Grid xs={12} md={6} className="p-6" item>
        <motion.div
          initial={{ opacity: 0, x: 5 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 5 }}
          transition={{
            type: "spring",
            bounce: 0,
          }}
        >
          <Stack rowGap={2}>
            <IntroductionText
              name={formik.values.name}
              surname={formik.values.surname}
            />
            <IntroductionFields />
          </Stack>
        </motion.div>
      </Grid>
    </Grid>
  );
}

export default withContextSaver(DesktopIntroduction);
