// Formik
import { useFormikContext } from "formik";

// MUI
import { Grid, Stack } from "@mui/material";

// Animation
import { motion } from "framer-motion";

// Components
import ExplainSection from "./DesktopExplainSection";
import CredentialsText from "../../shared/sign-up/CredentialsText";
import CredentialsFields from "../../shared/sign-up/CredentialsFields";

function DesktopCredentials() {
	const formik: any = useFormikContext();

	return (
		<Grid container>
			<ExplainSection
				step={3}
				title="Desktop"
				paragraph="Try to pick a username you easily remember and a<strong> strong password </strong> so your data is safe."
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
						<CredentialsText name={formik.values.name} />
						<CredentialsFields />
					</Stack>
				</motion.div>
			</Grid>
		</Grid>
	);
}

export default DesktopCredentials;
