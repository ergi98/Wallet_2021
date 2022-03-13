// Navigation
import { useNavigate } from "react-router-dom";

// MUI
import { Button, Typography, Divider, Grid, Paper } from "@mui/material";

// Animation
import { motion } from "framer-motion";

// Logo
import { ReactComponent as WalletLogo } from "../../assets/logo/wallet-logo.svg";

// Illustration
import { ReactComponent as EasyIllustration } from "../../assets/illustrations/easy.svg";
import { ReactComponent as SecureIllustration } from "../../assets/illustrations/secure.svg";
import { ReactComponent as AnalysisIllustration } from "../../assets/illustrations/analysis.svg";

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

function InitialScreen() {
  const navigate = useNavigate();

  const navigateTo = (url: string) => navigate(url);

  return (
    <div className="relative z-50 full-height flex justify-center overflow-auto py-10">
      <div className="my-auto w-10/12 max-w-7xl p-3">
        <Grid container direction="column" alignItems="center">
          <Grid item>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 1, y: -8 }}
              transition={{
                type: "spring",
                stiffness: 100,
                duration: 150,
              }}
            >
              <WalletLogo className="relative w-20 sm:w-24 mx-auto mt-0 h-auto" />
            </motion.div>
          </Grid>
          <Grid item>
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
          <Grid className="w-full sm:w-4/5" item>
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
                every transaction you do during the day and provide useful
                reports and charts to visualize your spending habits.
              </Typography>
            </motion.div>
          </Grid>
          <Grid className="py-12" item>
            <Grid
              className="justify-center"
              container
              rowSpacing={8}
              columnSpacing={8}
            >
              {mainPoints.map((point) => (
                <Grid item>
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
                        backgroundColor: "#FFFFFF80",
                      }}
                      className="p-5 mb-3"
                      elevation={4}
                    >
                      {point.icon}
                    </Paper>
                    <div className="text-gray-100 min-w-[250px] max-w-fit">
                      {point.text}
                    </div>
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
            <Grid className="pt-3" item>
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
      </div>
    </div>
  );
}

export default InitialScreen;
