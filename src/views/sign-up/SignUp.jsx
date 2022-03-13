import { Grid, Paper } from "@mui/material";

// Animation
// import { motion } from "framer-motion";

// Logo
import { ReactComponent as WalletLogo } from "../../assets/logo/wallet-logo.svg";

// Components
import SignUpForm from "../../components/sign-up/SignUpForm";

function SignUp() {
  return (
    <Grid
      className="z-50 relative flex mx-auto top-2/4 -translate-y-[55%] sm:-translate-y-[50%]"
      direction="column"
      alignItems="center"
      rowSpacing={{ xs: 6, sm: 10, md: 10, lg: 10, xl: 10, "2xl": 10 }}
      container
    >
      <Grid item>
        <WalletLogo className="w-20 sm:w-24 mx-auto mt-0 h-auto" />
      </Grid>
      <Grid className=" w-11/12 md:w-fit" item>
        <Paper className="bg-gradient-to-b from-gray-100 to-gray-50">
          <SignUpForm />
        </Paper>
      </Grid>
    </Grid>
  );
}

export default SignUp;
