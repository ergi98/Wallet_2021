import { lazy, Suspense } from "react";

// Router
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

// Animations
import { AnimatePresence } from "framer-motion";

// Components
import PageLoading from "../components/general/PageLoading";
const Pin = lazy(() => import("../views/pin/Pin"));
const Home = lazy(() => import("../views/home/Home"));
const Login = lazy(() => import("../views/login/Login"));
const SignUp = lazy(() => import("../views/sign-up/SignUp"));
const HeatMap = lazy(() => import("../views/heat-map/HeatMap"));
const PublicRoute = lazy(() => import("./PublicRoute"));
const Analysis = lazy(() => import("../views/analysis/Analysis"));
const Settings = lazy(() => import("../views/settings/Settings"));
const NotFound = lazy(() => import("../views/not-found/NotFound"));
const ProtectedRoute = lazy(() => import("./ProtectedRoute"));
const Portfolios = lazy(() => import("../views/portfolios/Portfolios"));
const Transactions = lazy(() => import("../views/transactions/Transactions"));
const SelectLocation = lazy(
  () => import("../views/select-location/SelectLocation")
);
const InitialScreen = lazy(
  () => import("../views/initial-screen/InitialScreen")
);
const RegisterProfit = lazy(
  () => import("../views/register-profit/RegisterProfit")
);
const RegisterExpense = lazy(
  () => import("../views/register-expense/RegisterExpense")
);
const Profile = lazy(() => import("../views/profile/Profile"));
const AppNavigation = lazy(
  () => import("../components/app-navigation/AppNavigation")
);

const appRoutes = [
  {
    path: "/",
    element: <InitialScreen />,
    private: false,
  },
  {
    path: "/login",
    element: <Login />,
    private: false,
  },
  {
    path: "/sign-up/:step",
    element: <SignUp />,
    private: false,
  },
  {
    path: "/pin",
    element: <Pin />,
    private: true,
  },
  {
    path: "/home",
    element: <Home />,
    private: true,
  },
  {
    path: "/portfolios",
    element: <Portfolios />,
    private: true,
  },
  {
    path: "/settings",
    element: <Settings />,
    private: true,
  },
  {
    path: "/profile",
    element: <Profile />,
    private: true,
  },
  {
    path: "/profit",
    element: <RegisterProfit />,
    private: true,
  },
  {
    path: "/expense",
    element: <RegisterExpense />,
    private: true,
  },
  {
    path: "/expense/select-location",
    element: <SelectLocation />,
    private: true,
  },
  {
    path: "/transactions",
    element: <Transactions />,
    private: true,
  },
  {
    path: "/analysis",
    element: <Analysis />,
    private: true,
  },
  {
    path: "/analysis/heat-map",
    element: <HeatMap />,
    private: true,
  },
  {
    path: "*",
    element: <NotFound />,
    private: false,
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
                    element={
                      <ProtectedRoute authenticated={props.isAuthenticated}>
                        {route.element}
                      </ProtectedRoute>
                    }
                  />
                ) : (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={
                      <PublicRoute authenticated={props.isAuthenticated}>
                        {route.element}
                      </PublicRoute>
                    }
                  />
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
