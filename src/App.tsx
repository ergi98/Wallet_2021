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

const theme = createTheme({
  palette: {
    primary: {
      main: "#2196F3",
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
            <TopRightBlob className="z-0 top-0 right-0 absolute rotate-50 transform select-none translate-x-1/2 -translate-y-1/2" />
            <MiddleLeftBlob className="z-0 left-0 top-1/4 absolute transform select-none -translate-y-1/5 -translate-x-1/3" />
            <BottomRightBlob className="z-0 right-0 bottom-0 absolute transform select-none translate-y-1/4 translate-x-1/3" />
            <AppRoutes isAuthenticated={isAuthenticated} />
          </ThemeProvider>
        </React.StrictMode>
      </Container>
    </CssBaseline>
  );
}

export default App;
