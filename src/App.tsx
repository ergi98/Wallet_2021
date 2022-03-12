import React, { useEffect, useState } from "react";

// MUI
import Container from "@mui/material/Container";

import { createTheme, ThemeProvider } from "@mui/material/styles";

// Assets
import { ReactComponent as TopRightBlob } from "./assets/blobs/top_right_blob.svg";
import { ReactComponent as MiddleLeftBlob } from "./assets/blobs/middle_left_blob.svg";
import { ReactComponent as BottomRightBlob } from "./assets/blobs/bottom_right_blob.svg";

// Components
import AppRoutes from "./routes/AppRoutes";
import { CssBaseline } from "@mui/material";

declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    "2xl": true;
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#2563eb",
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      "2xl": 1536,
    },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Global View Height (Mobile 100vh Fix)
  useEffect(() => {
    function setGlobalVh() {
      let vh = window.innerHeight * 0.01;
      let root = document.querySelector<HTMLElement>(":root");
      root!.style.setProperty("--vh", `${vh}px`);
      window.addEventListener("resize", setGlobalVh);
      window.addEventListener("orientationchange", setGlobalVh);
    }
    setGlobalVh();
    return () => {
      window.removeEventListener("resize", setGlobalVh);
      window.removeEventListener("orientationchange", setGlobalVh);
    };
  }, []);

  return (
    <CssBaseline>
      <Container
        disableGutters
        maxWidth={false}
        className="full-height overflow-hidden relative bg-gradient-to-b from-blue-900 to-blue-400"
      >
        <React.StrictMode>
          <ThemeProvider theme={theme}>
            <AppRoutes isAuthenticated={isAuthenticated} />
          </ThemeProvider>
        </React.StrictMode>
      </Container>
      <TopRightBlob className="top-0 right-0 absolute rotate-50 select-none translate-x-1/2 -translate-y-1/2" />
      <MiddleLeftBlob className="left-0 top-1/4 absolute select-none -translate-y-1/5 -translate-x-1/3" />
      <BottomRightBlob className="right-0 bottom-0 absolute select-none translate-y-1/4 translate-x-1/3" />
    </CssBaseline>
  );
}

export default App;
