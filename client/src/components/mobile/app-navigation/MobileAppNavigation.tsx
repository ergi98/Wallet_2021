import { useState, ReactNode } from "react";

// MUI
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import SvgIcon from "@mui/material/SvgIcon";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";

// Icons
import {
	RiHome2Line,
	RiHome2Fill,
	RiWalletFill,
	RiWalletLine,
	RiSettings4Line,
	RiSettings4Fill,
	RiPieChartLine,
	RiPieChart2Fill,
} from "react-icons/ri";

// Router
import { useLocation, useNavigate } from "react-router-dom";

interface NavigationItem {
	key: string;
	path: string;
	icon: ReactNode;
	activeIcon?: ReactNode;
}

const navigationItems: Array<NavigationItem> = [
	{
		key: "settings",
		path: "/settings",
		icon: <RiSettings4Line />,
		activeIcon: <RiSettings4Fill />,
	},
	{
		key: "portfolios",
		path: "/portfolios",
		icon: <RiWalletLine />,
		activeIcon: <RiWalletFill />,
	},
	{
		key: "home",
		path: "/home/expenses",
		icon: <RiHome2Line />,
		activeIcon: <RiHome2Fill />,
	},
	{
		key: "analysis",
		path: "/analysis",
		icon: <RiPieChartLine />,
		activeIcon: <RiPieChart2Fill />,
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
];

function AppNavigation() {
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const [activePath, setActivePath] = useState<Number>(() =>
		selectCurrentRoute()
	);

	function handleUserNavigation(_: any, value: number) {
		if (pathname === navigationItems[value].path) return;
		setActivePath(value);
		navigate(`${navigationItems[value].path}`);
	}

	function selectCurrentRoute() {
		let routeIndex = navigationItems.findIndex(
			(route) => route.path === pathname
		);
		return routeIndex === -1 ? 0 : routeIndex;
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
					<BottomNavigationAction
						icon={
							item.activeIcon ? (
								<SvgIcon className={`${activePath !== index && "scale-75"}`}>
									{activePath === index ? item.activeIcon : item.icon}
								</SvgIcon>
							) : (
								item.icon
							)
						}
						key={item.key}
					/>
				))}
			</BottomNavigation>
		</Paper>
	);
}

export default AppNavigation;
