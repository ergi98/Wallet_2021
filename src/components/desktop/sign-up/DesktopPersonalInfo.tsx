// Formik
import { useFormikContext } from "formik";

// MUI
import { Grid, Stack } from "@mui/material";

// Animation
import { motion } from "framer-motion";

// Components
import ExplainSection from "./DesktopExplainSection";
import PersonalInfoText from "../../shared/sign-up/PersonalInfoText";
import PersonalInfoFields from "../../shared/sign-up/PersonalInfoFields";

function DesktopPersonalInfo() {
  const formik: any = useFormikContext();

  return (
    <Grid container>
      <ExplainSection
        step={2}
        title={`Lets get to know you ${formik.values.name?.trim()}.`}
        paragraph="Tell us a little bit more about yourself and what you do."
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
          <Stack>
            <PersonalInfoText name={formik.values.name} />
            <PersonalInfoFields />
          </Stack>
        </motion.div>
      </Grid>
    </Grid>
  );
}

export default DesktopPersonalInfo;
