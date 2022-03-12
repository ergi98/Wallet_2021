import { Grid, Typography, Card, CardHeader, CardContent } from "@mui/material";

// Logo
import { ReactComponent as WalletLogo } from "../../assets/logo/wallet-logo.svg";

// Components
import LoginForm from "../../components/login/LoginForm";

function Login() {
  async function loginUser(credentials: Object) {}

  return (
    <Grid
      className="z-50 relative max-w-[90%] sm:max-w-[80%] flex mx-auto top-2/4 -translate-y-[55%] sm:-translate-y-[50%]"
      direction="column"
      alignItems="center"
      rowSpacing={{ xs: 6, sm: 10, md: 10, lg: 10, xl: 10, "2xl": 10 }}
      container
    >
      <Grid item>
        <WalletLogo className="w-20 sm:w-24 mx-auto mt-0 h-auto" />
      </Grid>
      <Grid item>
        <Card raised className="my-auto p-3">
          <CardHeader
            title={
              <Typography variant="h5" className="text-center text-slate-900">
                Welcome to Wallet!
              </Typography>
            }
            subheader={
              <Typography paragraph>
                To login please enter your account credentials.
              </Typography>
            }
          />
          <CardContent children={<LoginForm />} />
        </Card>
      </Grid>
    </Grid>
  );
}

export default Login;
