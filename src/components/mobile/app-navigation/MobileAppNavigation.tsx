import { useMemo, useState } from "react";

// MUI
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";

// Router
import { useNavigate } from "react-router-dom";
import {
  Settings,
  HomeRounded,
  HomeOutlined,
  SettingsOutlined,
  ShowChartRounded,
  AccountBalanceWallet,
  StackedLineChartRounded,
  AccountBalanceWalletOutlined,
} from "@mui/icons-material";

function AppNavigation() {
  const [activePath, setActivePath] = useState<Number>(2);

  const navigate = useNavigate();

  const navigationItems = useMemo(
    () => [
      {
        key: "settings",
        icon:
          activePath === 0 ? (
            <Settings />
          ) : (
            <SettingsOutlined className="text-neutral-400" />
          ),
        path: "/settings",
      },
      {
        key: "portfolios",
        icon:
          activePath === 1 ? (
            <AccountBalanceWallet />
          ) : (
            <AccountBalanceWalletOutlined className="text-neutral-400" />
          ),
        path: "/portfolios",
      },
      {
        key: "home",
        icon:
          activePath === 2 ? (
            <HomeRounded />
          ) : (
            <HomeOutlined className="text-neutral-400" />
          ),
        path: "/home/expenses",
      },
      {
        key: "analysis",
        icon:
          activePath === 3 ? (
            <StackedLineChartRounded />
          ) : (
            <ShowChartRounded className="text-neutral-400" />
          ),
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
      className="pb-env"
      elevation={10}
      square
    >
      <BottomNavigation
        value={activePath}
        showLabels={false}
        sx={{ padding: 0 }}
        onChange={handleUserNavigation}
      >
        {navigationItems.map((item, index) => (
          <BottomNavigationAction icon={item.icon} key={item.key} />
        ))}
      </BottomNavigation>
    </Paper>
  );
}

export default AppNavigation;
