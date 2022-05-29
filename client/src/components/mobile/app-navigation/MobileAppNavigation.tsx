import { useEffect, useMemo, useState } from "react";

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

function AppNavigation() {
	const [activePath, setActivePath] = useState<Number>(2);

	const navigate = useNavigate();
	const { pathname } = useLocation();

	const navigationItems = useMemo(
		() => [
			{
				key: "settings",
				icon: (
					<SvgIcon className={`${activePath !== 0 && "scale-75"}`}>
						{activePath === 0 ? <RiSettings4Fill /> : <RiSettings4Line />}
					</SvgIcon>
				),
				path: "/settings",
			},
			{
				key: "portfolios",
				icon: (
					<SvgIcon className={`${activePath !== 1 && "scale-75"}`}>
						{activePath === 1 ? <RiWalletFill /> : <RiWalletLine />}
					</SvgIcon>
				),
				path: "/portfolios",
			},
			{
				key: "home",
				icon: (
					<SvgIcon className={`${activePath !== 2 && "scale-75"}`}>
						{activePath === 2 ? <RiHome2Fill /> : <RiHome2Line />}
					</SvgIcon>
				),
				path: "/home/expenses",
			},
			{
				key: "analysis",
				icon: (
					<SvgIcon className={`${activePath !== 3 && "scale-75"}`}>
						{activePath === 3 ? <RiPieChart2Fill /> : <RiPieChartLine />}
					</SvgIcon>
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
		if (pathname === navigationItems[value].path) return;
		setActivePath(value);
		navigate(`${navigationItems[value].path}`);
	}

	useEffect(() => {
		function selectCurrentRoute() {
			let routeIndex = navigationItems.findIndex(
				(route) => route.path === pathname
			);
			if (routeIndex !== -1) setActivePath(routeIndex);
		}
		selectCurrentRoute();
	}, []);

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
				{navigationItems.map((item) => (
					<BottomNavigationAction icon={item.icon} key={item.key} />
				))}
			</BottomNavigation>
		</Paper>
	);
}

export default AppNavigation;
