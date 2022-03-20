import { Stack, Typography, Card, CardHeader, CardContent } from "@mui/material";

// Animation
import { motion } from "framer-motion";

// Navigation
import { useNavigate } from "react-router-dom";

// Logo
import { ReactComponent as WalletLogo } from "../../../assets/logo/wallet-logo.svg";

// Components
import LoginForm from "../../../components/shared/login/LoginForm";

function Login() {
  const navigate = useNavigate();
  const navigateHome = () => navigate("/");

  return (
    <>
      <div className="absolute top-12 sm:top-32 left-1/2 -translate-x-1/2">
        <motion.div
          exit={{ opacity: 0, y: -20 }}
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
      </div>
      <Stack
        className="pt-32 sm:pt-60 w-full"
        alignItems="center"
      >
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
          <Card raised className="w-screen-md mx-3 p-3">
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
        </motion.div>
      </Stack>
    </>
  );
}

export default Login;
