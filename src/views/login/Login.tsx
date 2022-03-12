import { Grid, Typography, Card, CardHeader, CardContent } from "@mui/material";

// Logo
import { ReactComponent as AlternativeWalletLogo } from "../../assets/logo/wallet-logo-alternative.svg";

// Components
import LoginForm from "../../components/login/LoginForm";

function Login() {
  async function loginUser(credentials: Object) {}

  return (
    <div className="relative z-50 full-height flex justify-center overflow-auto py-10">
      <Card raised className="my-auto p-3 max-w-[80%]">
        <CardHeader
          title={
            <AlternativeWalletLogo className="w-16 sm:w-24 mx-auto mt-0 h-auto" />
          }
          subheader={
            <div className="flex items-center flex-col pt-2">
              <Typography variant="h6" className=" text-slate-900">
                Welcome to Wallet!
              </Typography>
              <Typography paragraph>
                To login please enter your account credentials.
              </Typography>
            </div>
          }
        />
        <CardContent children={<LoginForm />} />
      </Card>
    </div>
  );
}

export default Login;
