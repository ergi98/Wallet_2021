// MUI
import { Stack, Paper } from "@mui/material";
import { useEffect } from "react";

// Navigation
import { useNavigate } from "react-router-dom";

// Animation
// import { motion } from "framer-motion";

// Logo
import { ReactComponent as WalletLogo } from "../../assets/logo/wallet-logo.svg";

// Components
import SignUpForm from "../../components/sign-up/SignUpForm";

function SignUp() {
  const navigate = useNavigate();
  const navigateHome = () => navigate("/");
  
  return (
    <Stack
      className="relative z-10 w-full h-full"
      justifyContent="center"
      alignItems="center"
      spacing={8}
    >
      {/* Logo */}
      <WalletLogo
        onClick={navigateHome}
        className="w-20 sm:w-24 mx-auto mt-0 h-auto cursor-pointer hover:scale-110 transition-transform"
      />
      {/* All the rest */}
      <Paper className="md:w-auto w-11/12 max-w-4xl bg-gradient-to-b from-gray-100 to-gray-50">
        <SignUpForm />
      </Paper>
    </Stack>
  );
}

export default SignUp;
