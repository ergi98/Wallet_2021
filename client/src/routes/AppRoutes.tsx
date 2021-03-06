import { Suspense, useEffect, useMemo, useState } from "react";

// Router
import { Route, Routes, useLocation } from "react-router-dom";

// Animations
import { AnimatePresence } from "framer-motion";

// Utilities
import { isMobile } from "../utilities/mobile-utilities";

// Hooks
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useRefreshToken from "../hooks/useRefreshToken";

// Redux
import { useAppDispatch, useAppSelector } from "../redux_store/hooks";
import { setUser } from "../features/user/user-slice";
import { setBanks } from "../features/bank/bank-slice";
import { setSources } from "../features/source/source-slice";
import { setCurrencies } from "../features/currency/currency-slice";
import { setCategories } from "../features/category/category-slice";
import { fetchNecessaryData } from "../features/general/general-slice";
import {
	setPortfolios,
	setPortfolioTypes,
} from "../features/portfolio/portfolio-slice";
import { setTransactionTypes } from "../features/transactions/transaction-slice";

// General
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "../views/not-found/NotFound";
import PageLoading from "../components/general/PageLoading";

// Desktop
import DesktopLogin from "../views/desktop/login/DesktopLogin";
import DesktopSignUp from "../views/desktop/sign-up/DesktopSignUp";
import DesktopCredentials from "../components/desktop/sign-up/DesktopCredentials";
import DesktopPersonalInfo from "../components/desktop/sign-up/DesktopPersonalInfo";
import DesktopIntroduction from "../components/desktop/sign-up/DesktopIntroduction";
import DesktopInitialScreen from "../views/desktop/initial-screen/DesktopInitialScreen";

// import HomeEarnings from "../views/mobile/home/HomeEarnings";
// import HomeExpenses from "../views/mobile/home/HomeExpenses";
// import Pin from "../views/pin/Pin";
// import HeatMap from "../views/heat-map/HeatMap";
// import Analysis from "../views/analysis/Analysis";
// import Settings from "../views/settings/Settings";
// import Portfolios from "../views/portfolios/Portfolios";
// import Transactions from "../views/transactions/Transactions";
// import SelectLocation from "../views/select-location/SelectLocation";
// import RegisterIncome from "../views/register-income/RegisterIncome";
// import RegisterExpense from "../views/register-expense/RegisterExpense";
// import Profile from "../views/profile/Profile";

// Mobile
import AppNavigation from "../components/mobile/app-navigation/MobileAppNavigation";
import MobileCredentials from "../components/mobile/sign-up/MobileCredentials";
import MobilePersonalInfo from "../components/mobile/sign-up/MobilePersonalInfo";
import MobileIntroduction from "../components/mobile/sign-up/MobileIntroduction";

import MobileLogin from "../views/mobile/login/MobileLogin";
import MobileSignUp from "../views/mobile/sign-up/MobileSignUp";
import MobileInitialScreen from "../views/mobile/initial-screen/MobileInitialScreen";

import MobileHomeExpenses from "../views/mobile/home/MobileHomeExpenses";
import MobileHomeEarnings from "../views/mobile/home/MobileHomeEarnings";

import MobileSettings from "../views/mobile/settings/MobileSettings";

import MobilePortfolios from "../views/mobile/portfolios/MobilePortfolios";
import RedirectMobileHome from "../components/mobile/home/RedirectMobileHome";

const desktopRoutes = [
	{
		path: "/",
		element: <DesktopInitialScreen />,
		private: false,
		index: false,
	},
	{
		path: "/login",
		element: <DesktopLogin />,
		private: false,
		index: false,
	},
	{
		path: "/sign-up",
		element: <DesktopSignUp />,
		private: false,
		index: false,
		children: [
			{
				path: "introduction",
				element: <DesktopIntroduction />,
			},
			{
				path: "personal-info",
				element: <DesktopPersonalInfo />,
			},
			{
				path: "credentials",
				element: <DesktopCredentials />,
			},
			{
				path: "*",
				element: <NotFound />,
			},
		],
	},
];

const mobileRoutes = [
	{
		path: "/",
		element: <MobileInitialScreen />,
		private: false,
		index: false,
	},
	{
		path: "/login",
		element: <MobileLogin />,
		private: false,
		index: false,
	},
	{
		path: "/sign-up",
		element: <MobileSignUp />,
		private: false,
		index: false,
		children: [
			{
				path: "introduction",
				element: <MobileIntroduction />,
			},
			{
				path: "personal-info",
				element: <MobilePersonalInfo />,
			},
			{
				path: "credentials",
				element: <MobileCredentials />,
			},
			{
				path: "*",
				element: <NotFound />,
			},
		],
	},
	{
		path: "/home",
		element: <RedirectMobileHome />,
		private: true,
		index: false,
	},
	{
		path: "/home/expenses",
		element: <MobileHomeExpenses />,
		private: true,
		index: false,
	},
	{
		path: "/home/earnings",
		element: <MobileHomeEarnings />,
		private: true,
		index: false,
	},
	{
		path: "/settings",
		element: <MobileSettings />,
		private: true,
		index: false,
	},
	{
		path: "/portfolios",
		element: <MobilePortfolios />,
		private: true,
		index: false,
	},
];

const appRoutes = isMobile ? mobileRoutes : desktopRoutes;

function AppRoutes() {
	const location = useLocation();
	const axios = useAxiosPrivate();
	const dispatch = useAppDispatch();
	const refreshToken = useRefreshToken();

	const token = useAppSelector((state) => state.auth.token);
	const fetched = useAppSelector((state) => state.general.fetched);
	const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

	const showMobileNavigation = useMemo(
		() => isAuthenticated && isMobile,
		[isAuthenticated]
	);

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		function addEventListener() {
			window.addEventListener("load", getRefreshedToken);
		}
		addEventListener();
		return () => {
			window.removeEventListener("load", getRefreshedToken);
		};
	}, []);

	async function getRefreshedToken() {
		if (token) return setLoading(false);
		await refreshToken();
		setLoading(false);
	}

	useEffect(() => {
		async function fetchAppData() {
			if (fetched || !token) return;
			const result = await dispatch(fetchNecessaryData(axios)).unwrap();
			dispatch(setUser(result.user));
			dispatch(setBanks(result.banks));
			dispatch(setSources(result.sources));
			dispatch(setPortfolios(result.portfolios));
			dispatch(setCurrencies(result.currencies));
			dispatch(setCategories(result.categories));
			dispatch(setPortfolioTypes(result.portfolioTypes));
			dispatch(setTransactionTypes(result.transactionTypes));
		}
		fetchAppData();
	}, [token, fetched, axios, dispatch]);

	if (loading) return <PageLoading />;

	return (
		<Suspense fallback={<PageLoading />}>
			<AnimatePresence exitBeforeEnter>
				<Routes key={location.pathname} location={location}>
					{appRoutes.map((route) =>
						route.private ? (
							<Route
								key={route.path}
								path={route.path}
								index={route.index}
								element={
									<ProtectedRoute authenticated={isAuthenticated}>
										{route.element}
									</ProtectedRoute>
								}
							>
								{route.children
									? route.children.map((child) => (
											<Route
												key={child.path}
												path={child.path}
												element={child.element}
											/>
									  ))
									: null}
							</Route>
						) : (
							<Route
								key={route.path}
								path={route.path}
								index={route.index}
								element={
									<PublicRoute authenticated={isAuthenticated}>
										{route.element}
									</PublicRoute>
								}
							>
								{route.children
									? route.children.map((child) => (
											<Route
												key={child.path}
												path={child.path}
												element={child.element}
											/>
									  ))
									: null}
							</Route>
						)
					)}
				</Routes>
			</AnimatePresence>
			{showMobileNavigation ? <AppNavigation /> : null}
		</Suspense>
	);
}

export default AppRoutes;
