import React from "react";

// MUI
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Components
import AppRoutes from "./routes/AppRoutes";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2196F3",
    },
  },
});

function App() {
  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <AppRoutes />
      </ThemeProvider>
    </React.StrictMode>
  );
}

export default App;
