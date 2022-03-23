import { useState, useEffect } from "react";

// Navigation
import { useNavigate } from "react-router-dom";

// MUI
import { Button, Typography, Divider, Grid, Paper } from "@mui/material";

// Animation
import { motion } from "framer-motion";

// Logo
import { ReactComponent as WalletLogo } from "../../../assets/logo/wallet-logo.svg";

// Illustration
import { ReactComponent as EasyIllustration } from "../../../assets/illustrations/easy.svg";
import { ReactComponent as SecureIllustration } from "../../../assets/illustrations/secure.svg";
import { ReactComponent as AnalysisIllustration } from "../../../assets/illustrations/analysis.svg";

const iconClasses = "w-32 h-32";

const mainPoints = [
  {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    icon: <SecureIllustration className={iconClasses} />,
    text: "Protected with multiple layers of security",
  },
  {
    initial: { opacity: 0, scale: 0.6 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.6 },
    icon: <AnalysisIllustration className={iconClasses} />,
    text: "Analysis of your expenditures at your fingertips",
  },
  {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    icon: <EasyIllustration className={iconClasses} />,
    text: "Easy and convenient to use",
  },
];

function DesktopInitialScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("register-context");
  }, []);

  const navigateTo = (url: string) => {
    switch (url) {
      case "/login":
        setExitStyles({ opacity: 1, y: 32 });
        break;
      case "/sign-up/introduction":
        setExitStyles({ opacity: 1 });
        break;
    }
    navigate(url);
  };

  const [exitStyles, setExitStyles] = useState<any>({ opacity: 1, y: 32 });

  return (
    <>
      <div className="absolute top-24 left-1/2 -translate-x-1/2">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={exitStyles}
          transition={{
            type: "spring",
            stiffness: 100,
            duration: 150,
          }}
        >
          <WalletLogo className="relative w-20 sm:w-24 mx-auto mt-0 h-auto" />
        </motion.div>
      </div>
      <Grid
        className="w-10/12 max-w-7xl mx-auto sm:pb-0 pb-6 pt-44 pb-env"
        alignItems="center"
        direction="column"
        container
      >
        <Grid xs={12} item>
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              duration: 500,
            }}
          >
            <Typography
              variant="h6"
              align="center"
              className="text-gray-100 pt-3"
              gutterBottom
            >
              Track your everyday transactions.
            </Typography>
          </motion.div>
        </Grid>
        <Grid xs={12} className="sm:w-2/3 w-4/5" item>
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              duration: 500,
            }}
          >
            <Typography className=" text-gray-100" paragraph>
              With wallet it is simple than ever to be on top of your
              expenditures and earnings. We help you keep track of each and
              every transaction you do during the day and provide useful reports
              and charts to visualize your spending habits.
            </Typography>
          </motion.div>
        </Grid>
        <Grid xs={12} className="py-12" item>
          <Grid
            className="justify-center"
            columnSpacing={8}
            rowSpacing={8}
            container
          >
            {mainPoints.map((point, index) => (
              <Grid xs={12} md={12} lg={4} xl={4} key={index} item>
                <motion.div
                  initial={point.initial}
                  animate={point.animate}
                  exit={point.exit}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    duration: 500,
                  }}
                  className="flex flex-col items-center"
                >
                  <Paper
                    sx={{
                      width: "fit-content",
                      borderRadius: "50%",
                      backgroundColor: "#FEFEFE",
                    }}
                    className="p-5 mb-3"
                    elevation={4}
                  >
                    {point.icon}
                  </Paper>
                  <div className="text-gray-100 w-64">{point.text}</div>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{
            type: "spring",
            stiffness: 100,
            duration: 650,
          }}
        >
          <Grid className="pt-12" item>
            <Button
              onClick={() => navigateTo("/sign-up/introduction")}
              variant="contained"
            >
              Create an Account
            </Button>
          </Grid>
          <Grid className="pt-3" item>
            <Divider className=" text-gray-100 w-48 text-[12px] ">OR</Divider>
          </Grid>
          <Grid className="pt-3 pb-6" item>
            <Button
              onClick={() => navigateTo("/login")}
              variant="text"
              sx={{ color: "#f3f4f6", fontSize: "12px" }}
            >
              Login with your account
            </Button>
          </Grid>
        </motion.div>
      </Grid>
    </>
  );
}

export default DesktopInitialScreen;
