import { lazy, Suspense } from "react";

// Router
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

// Animations
import { AnimatePresence } from "framer-motion";

// Components
import PublicRoute from "./PublicRoute";
import Login from "../views/desktop/login/Login";
import SignUp from "../views/desktop/sign-up/SignUp";
import ProtectedRoute from "./ProtectedRoute";
import PageLoading from "../components/general/PageLoading";
import InitialScreen from "../views/desktop/initial-screen/InitialScreen";
import Introduction from "../components/desktop/sign-up/Introduction";
import PersonalInfo from "../components/desktop/sign-up/PersonalInfo";
import Credentials from "../components/desktop/sign-up/Credentials";
import HomeEarnings from "../views/mobile/home/HomeEarnings";
import HomeExpenses from "../views/mobile/home/HomeExpenses";
const Pin = lazy(() => import("../views/pin/Pin"));
const HeatMap = lazy(() => import("../views/heat-map/HeatMap"));
const Analysis = lazy(() => import("../views/analysis/Analysis"));
const Settings = lazy(() => import("../views/settings/Settings"));
const NotFound = lazy(() => import("../views/not-found/NotFound"));
const Portfolios = lazy(() => import("../views/portfolios/Portfolios"));
const Transactions = lazy(() => import("../views/transactions/Transactions"));
const SelectLocation = lazy(
  () => import("../views/select-location/SelectLocation")
);
const RegisterIncome = lazy(
  () => import("../views/register-income/RegisterIncome")
);
const RegisterExpense = lazy(
  () => import("../views/register-expense/RegisterExpense")
);
const Profile = lazy(() => import("../views/profile/Profile"));
const AppNavigation = lazy(
  () => import("../components/mobile/app-navigation/AppNavigation")
);

const appRoutes = [
  {
    path: "/",
    element: <InitialScreen />,
    private: false,
    index: false,
  },
  {
    path: "/login",
    element: <Login />,
    private: false,
    index: false,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
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
  {
    path: "/pin",
    element: <Pin />,
    private: true,
    index: false,
  },
  {
    path: "/home/expenses",
    element: <HomeExpenses />,
    private: true,
    index: false,
  },
  {
    path: "/home/earnings",
    element: <HomeEarnings />,
    private: true,
    index: false,
  },
  {
    path: "/portfolios",
    element: <Portfolios />,
    private: true,
    index: false,
  },
  {
    path: "/settings",
    element: <Settings />,
    index: false,
    private: true,
  },
  {
    path: "/profile",
    element: <Profile />,
    private: true,
    index: false,
  },
  {
    path: "/income",
    element: <RegisterIncome />,
    private: true,
    index: false,
  },
  {
    path: "/expense",
    element: <RegisterExpense />,
    private: true,
    index: false,
  },
  {
    path: "/expense/select-location",
    element: <SelectLocation />,
    private: true,
    index: false,
  },
  {
    path: "/transactions",
    element: <Transactions />,
    private: true,
    index: false,
  },
  {
    path: "/analysis",
    element: <Analysis />,
    private: true,
    index: false,
  },
  {
    path: "/analysis/heat-map",
    element: <HeatMap />,
    private: true,
    index: false,
  },
  {
    path: "*",
    element: <NotFound />,
    private: false,
    index: false,
  },
];

interface PropsInterface {
  isAuthenticated: Boolean;
}

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
          {props.isAuthenticated && <AppNavigation />}
        </Suspense>
      ) : (
        <PageLoading />
      )}
    </>
  );
}

export default AppRoutes;
