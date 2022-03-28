import { useState } from "react";

// Logo
import { ReactComponent as WalletLogo } from "../../../assets/logo/wallet-logo.svg";

// Navigate
import { useLocation, useNavigate } from "react-router-dom";

// Animation
import { motion } from "framer-motion";

// MUI
import { Stack } from "@mui/material";

// Components
import SignUpForm from "../../../components/desktop/sign-up/SignUpForm";

function MobileSignUp() {
  const [delay, setDelay] = useState<number>(0.2);

  const navigate = useNavigate();
  const location: any = useLocation();

  const navigatingInternally: boolean = ["sign-up", "initial-page"].includes(
    location.state
  );

  window.history.replaceState({}, document.title);

  const navigateHome = () => {
    setDelay(0);
    navigate("/", { state: "sign-up" });
  };

  return (
    <div className="h-full w-full relative overflow-hidden">
      <motion.div
        initial={navigatingInternally ? {} : { opacity: 0, y: -10 }}
        animate={navigatingInternally ? {} : { opacity: 1, y: 0 }}
        exit={navigatingInternally ? {} : { opacity: 0, y: -10 }}
        transition={{
          bounce: 0,
          duration: 0.5,
        }}
      >
        <WalletLogo
          onClick={navigateHome}
          className="z-10 w-7 h-auto absolute top-3 left-1/2 -translate-x-1/2 cursor-pointer hover:scale-110 transition-transform"
        />
      </motion.div>
      <Stack className="w-full h-full">
        <div className="mt-auto">
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              bounce: 0,
              duration: 0.5,
              delay: delay,
            }}
          >
            <SignUpForm />
          </motion.div>
        </div>
      </Stack>
    </div>
  );
}

export default MobileSignUp;
