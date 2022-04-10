import {
	useState,
	Dispatch,
	ReactChild,
	createContext,
	SetStateAction,
} from "react";

interface ContextInterface {
	token: string | null;
	isAuthenticated: Boolean;
	setAuthState?: Dispatch<SetStateAction<ContextInterface>>;
}

interface PropsInterface {
	children: ReactChild;
}

const AuthContext = createContext<ContextInterface>({
	token: null,
	isAuthenticated: false,
});

export function AuthProvider({ children }: PropsInterface) {
	const [authState, setAuthState] = useState<ContextInterface>({
		token: null,
		isAuthenticated: false,
	});

	return (
		<AuthContext.Provider value={{ ...authState, setAuthState }}>
			{children}
		</AuthContext.Provider>
	);
}

export default AuthContext;
