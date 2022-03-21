// Logo
import { ReactComponent as WalletLogo } from "../../../assets/logo/wallet-logo.svg";

// MUI
import { Button, Divider, Stack, Typography } from "@mui/material";

// Carousel
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

// Navigation
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const navigateTo = (url: string) => {
    switch (url) {
      case "/login":
        break;
      case "/sign-up/introduction":
        break;
    }
    navigate(url);
  };

  return (
    <>
      <WalletLogo className="w-7 h-auto absolute top-3 left-3" />
      <Stack className="w-full h-full pb-env px-3">
        <Stack spacing={2} className="mt-auto pb-6 text-gray-100">
          <div>
            <Typography variant="h6">Welcome to Wallet!</Typography>
            <Typography variant="subtitle2" gutterBottom>
              Track your everyday transactions.
            </Typography>
          </div>
          <Carousel
            showThumbs={false}
            autoPlay={true}
            showStatus={false}
            showArrows={false}
            showIndicators={false}
            interval={5000}
            transitionTime={1000}
            className="py-3"
          >
            {mainPoints.map((point, index) => (
              <Stack alignItems="center" key={index}>
                {point.icon}
                <Typography paragraph>{point.text}</Typography>
              </Stack>
            ))}
          </Carousel>

          <Button onClick={() => navigateTo("/login")} variant="contained">
            Log In
          </Button>
          <Stack direction="row" justifyContent="center" alignItems="center">
            <Divider className="text-gray-100 w-1/2 text-[12px]">OR</Divider>
          </Stack>
          <Button
            onClick={() => navigateTo("/sign-up/introduction")}
            variant="text"
            sx={{
              color: "#f3f4f6",
              fontSize: "12px",
              border: "1px solid #f3f4f6",
            }}
          >
            Create an Account
          </Button>
        </Stack>
      </Stack>
    </>
  );
}

export default MobileInitialScreen;
