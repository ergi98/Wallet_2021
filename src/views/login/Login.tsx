import { Grid, Typography, Card, CardHeader, CardContent } from "@mui/material";

// Animation
import { motion } from "framer-motion";

// Navigation
import { useNavigate } from "react-router-dom";

// Logo
import { ReactComponent as WalletLogo } from "../../assets/logo/wallet-logo.svg";

// Components
import LoginForm from "../../components/login/LoginForm";

function Login() {
  const navigate = useNavigate();
  const navigateHome = () => navigate("/");

  return (
    <div className="z-10 relative full-height flex justify-center items-center overflow-auto">
      <Grid
        className="max-w-[90%] sm:max-w-[80%] flex"
        direction="column"
        alignItems="center"
        rowSpacing={{ xs: 6, sm: 10, md: 10, lg: 10, xl: 10, "2xl": 10 }}
        container
      >
        <Grid item>
          <motion.div
            exit={{ opacity: 0, y: -2 }}
            transition={{
              type: "spring",
              stiffness: 100,
              duration: 1000,
            }}
          >
            <WalletLogo
              onClick={navigateHome}
              className="w-20 sm:w-24 mx-auto mt-0 h-auto cursor-pointer hover:scale-110 transition-transform"
            />
          </motion.div>
        </Grid>
        <Grid item>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{
              type: "spring",
              stiffness: 100,
              duration: 1000,
            }}
          >
            <Card raised className="my-auto p-3">
              <CardHeader
                title={
                  <Typography
                    variant="h5"
                    className="text-center text-slate-900"
                  >
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
          </motion.div>
        </Grid>
      </Grid>
    </div>
  );
}

export default Login;
