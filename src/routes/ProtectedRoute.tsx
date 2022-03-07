import { ReactNode } from "react";

// Router
import { Navigate } from "react-router-dom";

interface PropsInterface {
  children: ReactNode;
  authenticated: Boolean;
}

function ProtectedRoute(props: PropsInterface) {
  return (
    <>
      {props.authenticated ? (
        props.children
      ) : (
        <Navigate to="/" replace={true} />
      )}
    </>
  );
}

export default ProtectedRoute;
