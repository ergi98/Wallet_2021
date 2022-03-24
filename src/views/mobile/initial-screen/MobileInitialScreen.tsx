import { useEffect, useState } from "react";

// Logo
import { ReactComponent as WalletLogo } from "../../../assets/logo/wallet-logo.svg";

// MUI
import { Button, Divider, Stack, Typography } from "@mui/material";

// Animation
import { motion } from "framer-motion";

// Carousel
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

// Navigation
import { useLocation, useNavigate } from "react-router-dom";

// Illustration
import { ReactComponent as EasyIllustration } from "../../../assets/illustrations/easy.svg";
import { ReactComponent as SecureIllustration } from "../../../assets/illustrations/secure.svg";
import { ReactComponent as AnalysisIllustration } from "../../../assets/illustrations/analysis.svg";

const iconClasses = "w-32 h-32";

const mainPoints = [
  {
    icon: <SecureIllustration className={iconClasses} />,
    text: "Protected with multiple layers of security",
  },
  {
    icon: <AnalysisIllustration className={iconClasses} />,
    text: "Analysis of your expenditures at your fingertips",
  },
  {
    icon: <EasyIllustration className={iconClasses} />,
    text: "Easy and convenient to use",
  },
];

function MobileInitialScreen() {
  const [delay, setDelay] = useState<number>(0.2);

  useEffect(() => {
    localStorage.removeItem("register-context");
  }, []);

  const navigate = useNavigate();
  const location: any = useLocation();

  const navigatingInternally: boolean = ["login", "sign-up"].includes(
    location.state
  );

  window.history.replaceState({}, document.title);

  const navigateTo = (url: string) => {
    setDelay(0);
    navigate(url, { state: "initial-page" });
  };

  return (
    <div className="w-full h-full relative">
      <motion.div
        initial={navigatingInternally ? { x: "43%" } : { opacity: 0, y: -10 }}
        animate={navigatingInternally ? { x: 0 } : { opacity: 1, y: 0 }}
        exit={{ x: "43%" }}
        transition={{
          bounce: 0,
          duration: 0.75,
        }}
      >
        <WalletLogo className="w-7 h-auto absolute top-3 left-3" />
      </motion.div>
      <Stack className="w-full h-full pb-env px-3">
        <Stack spacing={2} className="mt-auto pb-12 text-neutral-50">
          <div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{
                bounce: 0,
                duration: 0.75,
                delay: delay,
              }}
            >
              <Typography variant="h6">Welcome to Wallet!</Typography>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{
                bounce: 0,
                duration: 0.75,
                delay: delay * 1.25,
              }}
            >
              <Typography variant="subtitle2" gutterBottom>
                Track your everyday transactions.
              </Typography>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{
              bounce: 0,
              duration: 0.75,
              delay: delay * 1.75,
            }}
          >
            <Carousel
              showThumbs={false}
              autoPlay={true}
              showStatus={false}
              showArrows={false}
              showIndicators={false}
              interval={5000}
              transitionTime={300}
              className="py-3"
            >
              {mainPoints.map((point, index) => (
                <Stack alignItems="center" key={index}>
                  {point.icon}
                  <Typography paragraph>{point.text}</Typography>
                </Stack>
              ))}
            </Carousel>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{
              bounce: 0,
              duration: 0.75,
              delay: delay * 2,
            }}
          >
            <Button
              onClick={() => navigateTo("/login")}
              variant="contained"
              fullWidth
            >
              Log In
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{
              bounce: 0,
              duration: 0.75,
              delay: delay * 2.25,
            }}
          >
            <Stack direction="row" justifyContent="center" alignItems="center">
              <Divider className="text-neutral-50 w-1/2 text-[12px]">OR</Divider>
            </Stack>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{
              bounce: 0,
              duration: 0.75,
              delay: delay * 2.5,
            }}
          >
            <Button
              onClick={() => navigateTo("/sign-up/introduction")}
              variant="text"
              sx={{
                color: "#f3f4f6",
                fontSize: "12px",
                border: "1px solid #f3f4f6",
              }}
              fullWidth
            >
              Create an Account
            </Button>
          </motion.div>
        </Stack>
      </Stack>
    </div>
  );
}

export default MobileInitialScreen;
