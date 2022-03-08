import { useMemo, useState } from "react";

// MUI
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";

// SVGs
import { ReactComponent as Home } from "../../assets/icons/home.svg";
import { ReactComponent as Charts } from "../../assets/icons/charts.svg";
import { ReactComponent as Settings } from "../../assets/icons/settings.svg";
import { ReactComponent as Portfolios } from "../../assets/icons/portfolios.svg";

// Router
import { useNavigate } from "react-router-dom";

function AppNavigation() {
  const [activePath, setActivePath] = useState<Number>(2);

  const navigate = useNavigate();

  const navigationItems = useMemo(
    () => [
      {
        key: "settings",
        icon: <Settings className={`${activePath === 0 && " fill-gray-50"}`} />,
        path: "/settings",
      },
      {
        key: "portfolios",
        icon: (
          <Portfolios className={`${activePath === 1 && " fill-gray-50"}`} />
        ),
        path: "/portfolios",
      },
      {
        key: "home",
        icon: (
          <Home
            className={`${
              activePath === 2 ? " fill-gray-50 h-8 w-8" : "h-6 w-6"
            }`}
          />
        ),
        path: "/home",
      },
      {
        key: "analysis",
        icon: <Charts className={`${activePath === 3 && " fill-gray-50"}`} />,
        path: "/analysis",
      },
      {
        key: "profile",
        icon: (
          <Avatar
            alt="Ergi Dervishaj"
            src="/static/images/avatar/1.jpg"
            sx={{ width: 22, height: 22, fontSize: "12px" }}
          />
        ),
        path: "/profile",
      },
    ],
    [activePath]
  );

  function handleUserNavigation(event: any, value: number) {
    setActivePath(value);
    navigate(`${navigationItems[value].path}`);
  }

  return (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
      elevation={10}
      className="pt-2"
      square
    >
      <BottomNavigation
        value={activePath}
        showLabels={false}
        sx={{ gap: "12px" }}
        onChange={handleUserNavigation}
      >
        {navigationItems.map((item, index) => (
          <BottomNavigationAction
            sx={{
              ...{
                borderRadius: "50%",
                minWidth: "46px",
                height: "46px",
                flex: "0 0 46px",
              },
              ...(activePath === index
                ? {
                    backgroundImage:
                      "linear-gradient(to bottom, #1e3a8a, #60a5fa)",
                  }
                : {}),
            }}
            icon={item.icon}
            key={item.key}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}

export default AppNavigation;
