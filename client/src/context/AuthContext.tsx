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
			let status = false;
			let token = localStorage.getItem("token");
			let refresh = localStorage.getItem("refresh");
			if (token && refresh) status = true;
			updateRootContext({ isAuthenticated: status });
		}
		checkIfAuthenticated();
	}, []);

	function updateRootContext(data: ContextInterface) {
		setAuthContext((previous) => {
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
