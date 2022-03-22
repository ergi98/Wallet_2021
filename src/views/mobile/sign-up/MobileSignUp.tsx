// Logo
import { ReactComponent as WalletLogo } from "../../../assets/logo/wallet-logo.svg";

// Navigate
import { useNavigate } from "react-router-dom";

// MUI
import { Stack } from "@mui/material";

// Components
import SignUpForm from "../../../components/desktop/sign-up/SignUpForm";

function MobileSignUp() {
  const navigate = useNavigate();

  const navigateHome = () => {
    // setDelay(0);
    navigate("/", { state: "sign-up" });
  };

  return (
    <div className="h-full w-full relative overflow-hidden">
      <WalletLogo
        onClick={navigateHome}
        className="z-10 w-7 h-auto absolute top-3 left-1/2 -translate-x-1/2 cursor-pointer hover:scale-110 transition-transform"
      />
      <Stack className="w-full h-full">
        <div className="mt-auto">
          <SignUpForm />
        </div>
      </Stack>
    </div>
  );
}

export default MobileSignUp;
