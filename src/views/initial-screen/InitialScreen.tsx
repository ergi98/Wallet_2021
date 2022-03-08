// MUI
import { Button, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

// Logo
import { ReactComponent as WalletLogo } from "../../assets/logo/wallet-logo.svg";

function InitialScreen() {
  return (
    <div className="full-height flex justify-center overflow-auto">
      <Paper
        sx={{
          width: "clamp(300px, 80%, 1000px)",
          background: "transparent",
        }}
        className="my-auto"
      >
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ border: "1px solid red" }}
        >
          <Grid item>
            <WalletLogo className="w-3/12 mx-auto mt-0 h-auto py-10" />
          </Grid>
          <Grid item>
            <Typography
              variant="h6"
              align="center"
              className=" text-gray-100"
              gutterBottom
            >
              Track your everyday transactions.
            </Typography>
          </Grid>
          <Grid className="pb-12" item>
            <Typography className=" text-gray-100" paragraph>
              Create an account to get started with Wallet or sign in if you
              already have one.
            </Typography>
          </Grid>
          <Grid className=" w-2/3 py-12" item>
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              gap={2}
            >
              <Grid item>
                <Paper
                  sx={{
                    borderRadius: "50%",
                    minHeight: "100px",
                    minWidth: "100px",
                  }}
                  className="flex items-center justify-center"
                >
                  A
                </Paper>
              </Grid>
              <Grid item>
                <Paper
                  sx={{
                    borderRadius: "50%",
                    minHeight: "100px",
                    minWidth: "100px",
                  }}
                ></Paper>
              </Grid>
              <Grid item>
                <Paper
                  sx={{
                    borderRadius: "50%",
                    minHeight: "100px",
                    minWidth: "100px",
                  }}
                ></Paper>
              </Grid>
            </Grid>
          </Grid>
          <Grid className="pt-12" item>
            <Button variant="contained">Create an Account</Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

export default InitialScreen;
