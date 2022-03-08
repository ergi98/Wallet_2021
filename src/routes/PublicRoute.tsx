import { ReactNode } from "react";

// Router
import { Navigate } from "react-router-dom";

// type RouteTypes = "public" | "private";

interface PropsInterface {
  children: ReactNode;
  authenticated: Boolean;
  // routeType: RouteTypes;
}

function PublicRoute(props: PropsInterface) {
  return (
    <>
      {props.authenticated ? (
        <Navigate to="/home" replace={true} />
      ) : (
        props.children
      )}
    </>
  );
}

export default PublicRoute;
