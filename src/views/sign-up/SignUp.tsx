import { useState } from "react";

// MUI
import { Stack, Paper } from "@mui/material";

// Navigation
import { useNavigate } from "react-router-dom";

// Animation
import { motion } from "framer-motion";

// Logo
import { ReactComponent as WalletLogo } from "../../assets/logo/wallet-logo.svg";

// Components
import SignUpForm from "../../components/sign-up/SignUpForm";

function SignUp() {
  const [exitStyles, setExitStyles] = useState<any>();
  const [logoExitStyles, setLogoExitStyles] = useState<any>();

  const navigate = useNavigate();

  const navigateHome = () => {
    setExitStyles({ opacity: 0 });
    setLogoExitStyles({ opacity: 0, y: -20 });
    navigate("/");
  };

  return (
    <>
      <motion.div
        exit={logoExitStyles}
        transition={{
          type: "spring",
          stiffness: 100,
          duration: 150,
        }}
      >
        <WalletLogo
          onClick={navigateHome}
          className="absolute top-24 left-1/2 -translate-x-1/2 w-20 sm:w-24 h-auto  cursor-pointer hover:scale-110 transition-transform"
        />
      </motion.div>
      <div className="pt-60 pb-10 md:pb-0">
        {/* All the rest */}
        <motion.div
          exit={exitStyles}
          transition={{
            type: "spring",
            stiffness: 100,
            duration: 150,
          }}
        >
          <Stack alignItems="center">
            <Paper className="md:w-auto w-11/12 max-w-4xl bg-gradient-to-b from-gray-100 to-gray-50">
              <SignUpForm />
            </Paper>
          </Stack>
        </motion.div>
      </div>
    </>
  );
}

export default SignUp;
