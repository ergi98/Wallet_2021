// Navigation
import { useNavigate } from "react-router-dom";

// MUI
import { Button, Typography, Divider, Grid, Paper } from "@mui/material";

// Logo
import { ReactComponent as WalletLogo } from "../../assets/logo/wallet-logo.svg";

// Illustration
import { ReactComponent as EasyIllustration } from "../../assets/illustrations/easy.svg";
import { ReactComponent as SecureIllustration } from "../../assets/illustrations/secure.svg";
import { ReactComponent as AnalysisIllustration } from "../../assets/illustrations/analysis.svg";

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

function InitialScreen() {
  const navigate = useNavigate();

  const navigateTo = (url: string) => navigate(url);

  return (
    <div className="relative z-50 full-height flex justify-center overflow-auto py-10">
      <div className="my-auto w-10/12 max-w-7xl p-3">
        <Grid container direction="column" alignItems="center">
          <Grid item>
            <WalletLogo className="w-16 sm:w-24 mx-auto mt-0 h-auto " />
          </Grid>
          <Grid item>
            <Typography
              variant="h6"
              align="center"
              className="text-gray-100 pt-3"
              gutterBottom
            >
              Track your everyday transactions.
            </Typography>
          </Grid>
          <Grid className="w-full sm:w-4/5" item>
            <Typography className=" text-gray-100" paragraph>
              With wallet it is simple than ever to be on top of your
              expenditures and earnings. We help you keep track of each and
              every transaction you do during the day and provide useful reports
              and charts to visualize your spending habits.
            </Typography>
          </Grid>
          <Grid className="py-12" item>
            <Grid
              className="justify-center"
              container
              rowSpacing={8}
              columnSpacing={8}
            >
              {mainPoints.map((point) => (
                <Grid className="" item>
                  <div className="flex flex-col items-center">
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
                  </div>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid className="pt-12" item>
            <Button onClick={() => navigateTo("/sign-up")} variant="contained">
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
        </Grid>
      </div>
    </div>
  );
}

export default InitialScreen;
