import { useState, useEffect } from "react";

// Animation
import { motion } from "framer-motion";

// Logo
import { ReactComponent as WalletLogo } from "../../../assets/logo/wallet-logo.svg";

// MUI
import { Stack, Typography, Card, CardContent } from "@mui/material";

// Navigate
import { useLocation, useNavigate } from "react-router-dom";

// Components
import LoginForm from "../../../components/shared/login/LoginForm";

function MobileLogin() {
  const [delay, setDelay] = useState<number>(0.2);

  const navigate = useNavigate();
  const location: any = useLocation();

  useEffect(() => {
    localStorage.removeItem("register-context");
  }, []);

  const navigatingInternally: boolean = ["login", "initial-page"].includes(
    location.state
  );

  window.history.replaceState({}, document.title);

  const navigateHome = () => {
    setDelay(0);
    navigate("/", { state: "login" });
  };

  return (
    <div className="h-full w-full relative overflow-hidden">
      <motion.div
        initial={navigatingInternally ? {} : { opacity: 0, y: -10 }}
        animate={navigatingInternally ? {} : { opacity: 1, y: 0 }}
        exit={navigatingInternally ? {} : { opacity: 0, y: -10 }}
        transition={{
          bounce: 0,
          duration: 0.75,
        }}
      >
        <WalletLogo
          onClick={navigateHome}
          className="z-10 w-7 h-auto absolute top-3 left-1/2 -translate-x-1/2 cursor-pointer hover:scale-110 transition-transform"
        />
      </motion.div>
      <Stack className="h-full w-full">
        <Stack spacing={2} className="text-gray-100 w-full mt-auto pb-6 px-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{
              bounce: 0,
              duration: 1,
              delay: delay * 7,
            }}
          >
            <Typography variant="h6">Welcome Back!</Typography>
            <Typography variant="subtitle2">
              Log in using your credentials
            </Typography>
          </motion.div>
        </Stack>
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{
            bounce: 0,
            duration: 1,
            delay: delay,
          }}
        >
          <Card
            className="w-full rounded-t-3xl p-3 pt-8 pb-env h-fit"
            sx={{
              borderTopLeftRadius: "1.5rem",
              borderTopRightRadius: "1.5rem",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{
                bounce: 0,
                duration: 1,
                delay: delay * 5,
              }}
            >
              <CardContent className="pb-12" children={<LoginForm />} />
            </motion.div>
          </Card>
        </motion.div>
      </Stack>
    </div>
  );
}

export default MobileLogin;
