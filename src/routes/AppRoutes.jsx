import { lazy, Suspense } from "react";

// Router
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Components
import PageLoading from "../components/general/PageLoading";
const Pin = lazy(() => import("../views/pin/Pin"));
const Home = lazy(() => import("../views/home/Home"));
const Login = lazy(() => import("../views/login/Login"));
const SignUp = lazy(() => import("../views/sign-up/SignUp"));
const HeatMap = lazy(() => import("../views/heat-map/HeatMap"));
const PublicRoute = lazy(() => import("../routes/PublicRoute"));
const Analysis = lazy(() => import("../views/analysis/Analysis"));
const Settings = lazy(() => import("../views/settings/Settings"));
const NotFound = lazy(() => import("../views/not-found/NotFound"));
const ProtectedRoute = lazy(() => import("../routes/ProtectedRoute"));
const Portfolios = lazy(() => import("../views/portfolios/Portfolios"));
const Transactions = lazy(() => import("../views/transactions/Transactions"));
const SelectLocation = lazy(() =>
  import("../views/select-location/SelectLocation")
);
const InitialScreen = lazy(() =>
  import("../views/initial-screen/InitialScreen")
);
const RegisterProfit = lazy(() =>
  import("../views/register-profit/RegisterProfit")
);
const RegisterExpense = lazy(() =>
  import("../views/register-expense/RegisterExpense")
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
    path: "/sign-up",
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
    private: true,
  },
  {
    path: "/transactions",
    element: <Transactions />,
    element: <SelectLocation />,
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

function AppRoutes() {
  return (
    <>
      {/* Condition to check wether the initial setup has finished */}
      {true ? (
        <BrowserRouter>
          <Suspense fallback={<PageLoading />}>
            <Routes>
              {appRoutes.map((route) =>
                route.private ? (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={
                      <ProtectedRoute path={route.path}>
                        {route.element}
                      </ProtectedRoute>
                    }
                  />
                ) : (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={
                      <PublicRoute path={route.path}>
                        {route.element}
                      </PublicRoute>
                    }
                  />
                )
              )}
            </Routes>
          </Suspense>
        </BrowserRouter>
      ) : (
        <PageLoading />
      )}
    </>
  );
}

export default AppRoutes;
