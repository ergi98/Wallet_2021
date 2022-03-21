// Logo
import { ReactComponent as WalletLogo } from "../../../assets/logo/wallet-logo.svg";

// MUI
import { Stack, Typography, Card, CardContent } from "@mui/material";

// Navigate
import { useNavigate } from "react-router-dom";

// Components
import LoginForm from "../../../components/shared/login/LoginForm";

function MobileLogin() {
  const navigate = useNavigate();
  const navigateHome = () => navigate("/");

  return (
    <>
      <WalletLogo
        onClick={navigateHome}
        className="z-10 w-7 h-auto absolute top-3 left-1/2 -translate-x-1/2 cursor-pointer hover:scale-110 transition-transform"
      />
      <Stack className="h-full w-full relative">
        <Stack spacing={2} className="text-gray-100 w-full mt-auto pb-6 px-3">
          <div>
            <Typography variant="h6">Welcome Back!</Typography>
            <Typography variant="subtitle2">
              Log in using your credentials
            </Typography>
          </div>
        </Stack>
        <Card
          className="w-full rounded-t-3xl p-3 pt-8 h-fit"
          sx={{
            borderTopLeftRadius: "1.5rem",
            borderTopRightRadius: "1.5rem",
          }}
        >
          <CardContent children={<LoginForm />} />
        </Card>
      </Stack>
    </>
  );
}

export default MobileLogin;
