import {
  useState,
  useEffect,
  useContext,
  ReactChild,
  createContext,
} from "react";

interface ContextInterface {
  isAuthenticated: Boolean;
}

interface PropsInterface {
  children: ReactChild;
}

const initialContext: ContextInterface = {
  isAuthenticated: false,
};

const AuthContext = createContext<ContextInterface | undefined>(undefined);
const AuthUpdateContext = createContext<Function | undefined>(undefined);

export function useAuth() {
  return useContext(AuthContext);
}

export function useAuthUpdate() {
  return useContext(AuthUpdateContext);
}

export function ContextProvider({ children }: PropsInterface) {
  const [authContext, setAuthContext] = useState<ContextInterface>({
    ...initialContext,
  });

  useEffect(() => {
    function checkIfAuthenticated() {
      let authValue = JSON.parse(
        localStorage.getItem("jwt") ?? "false"
      );
      updateRootContext({ isAuthenticated: authValue });
      
    }
    checkIfAuthenticated();
  }, []);

  function updateRootContext(data: ContextInterface | null) {
    data === null
      ? setAuthContext({ ...initialContext })
      : setAuthContext((previous) => {
          return {
            ...previous,
            ...data,
          };
        });
  }

  return (
    <AuthContext.Provider value={authContext}>
      <AuthUpdateContext.Provider value={updateRootContext}>
        {children}
      </AuthUpdateContext.Provider>
    </AuthContext.Provider>
  );
}
