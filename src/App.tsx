import React, { useLayoutEffect, useState } from "react";

// MUI
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Container from "@mui/material/Container";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";

import { createTheme, ThemeProvider } from "@mui/material/styles";

// Assets
import { ReactComponent as TopRightBlob } from "./assets/blobs/top_right_blob.svg";
import { ReactComponent as MiddleLeftBlob } from "./assets/blobs/middle_left_blob.svg";
import { ReactComponent as BottomRightBlob } from "./assets/blobs/bottom_right_blob.svg";

import { ReactComponent as Settings } from "./assets/icons/settings.svg";
import { ReactComponent as Portfolios } from "./assets/icons/portfolios.svg";
import { ReactComponent as Home } from "./assets/icons/home.svg";
import { ReactComponent as Charts } from "./assets/icons/charts.svg";
// import { ReactComponent as  } from "./assets/blobs/bottom_right_blob.svg";

// Components
import AppRoutes from "./routes/AppRoutes";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2196F3",
    },
  },
});

const navigationItems = [
  {
    key: "settings",
    icon: <Settings className="scale-150" />,
    label: "Settings",
  },
  {
    key: "portfolios",
    icon: <Portfolios className="scale-150" />,
    label: "Portfolios",
  },
  {
    key: "home",
    icon: <Home className="scale-150" />,
    label: "Home",
  },
  {
    key: "analysis",
    icon: <Charts className="scale-150" />,
    label: "Analysis",
  },
  // {
  //   key: "profile",
  //   // icon: <PersonOutlinedIcon />,
  //   label: "profile",
  // },
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activePath, setActivePath] = useState("/");

  // Global View Height (Mobile 100vh Fix)
  useLayoutEffect(() => {
    function setGlobalVh() {
      let vh = window.innerHeight * 0.01;
      let root = document.querySelector<HTMLElement>(":root");
      root!.style.setProperty("--vh", `${vh}px`);
      window.addEventListener("resize", setGlobalVh);
    }
    setGlobalVh();
    return () => {
      window.removeEventListener("resize", setGlobalVh);
    };
  }, []);

  function handleUserNavigation(event: any) {
    console.log(event);
  }

  return (
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

          <Paper
            sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
            className="pb-3 pt-2"
            elevation={3}
          >
            <BottomNavigation
              sx={{ borderRadius: 0 }}
              value={activePath}
              onChange={handleUserNavigation}
            >
              {navigationItems.map((item) => (
                <BottomNavigationAction
                  label={item.label}
                  icon={item.icon}
                  key={item.key}
                />
              ))}
              <BottomNavigationAction
                icon={
                  <Avatar
                    alt="Ergi Dervishaj"
                    src="/static/images/avatar/1.jpg"
                    sizes="small"
                  />
                }
                label="profile"
              ></BottomNavigationAction>
            </BottomNavigation>
          </Paper>
        </ThemeProvider>
      </React.StrictMode>
    </Container>
  );
}

export default App;
