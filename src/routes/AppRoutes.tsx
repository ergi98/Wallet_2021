import { Suspense } from "react";

// Router
import { Route, Routes, useLocation } from "react-router-dom";

// Animations
import { AnimatePresence } from "framer-motion";

// General
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "../views/not-found/NotFound";
import PageLoading from "../components/general/PageLoading";

// Desktop
import DesktopLogin from "../views/desktop/login/DesktopLogin";
import DesktopSignUp from "../views/desktop/sign-up/DesktopSignUp";
import Credentials from "../components/desktop/sign-up/Credentials";
import PersonalInfo from "../components/desktop/sign-up/PersonalInfo";
import Introduction from "../components/desktop/sign-up/Introduction";
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
import AppNavigation from "../components/mobile/app-navigation/AppNavigation";

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
        element: <Introduction />,
      },
      {
        path: "personal-info",
        element: <PersonalInfo />,
      },
      {
        path: "credentials",
        element: <Credentials />,
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
        element: <Introduction />,
      },
      {
        path: "personal-info",
        element: <PersonalInfo />,
      },
      {
        path: "credentials",
        element: <Credentials />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];

interface PropsInterface {
  isAuthenticated: Boolean;
}

const isMobile = window.innerWidth <= 640;
const appRoutes = isMobile ? mobileRoutes : desktopRoutes;

function AppRoutes(props: PropsInterface) {
  const location = useLocation();
  return (
    <>
      {/* Condition to check wether the initial setup has finished */}
      {true ? (
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
                      <ProtectedRoute authenticated={props.isAuthenticated}>
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
                      <PublicRoute authenticated={props.isAuthenticated}>
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
          {props.isAuthenticated && isMobile ? <AppNavigation /> : null}
        </Suspense>
      ) : (
        <PageLoading />
      )}
    </>
  );
}

export default AppRoutes;
