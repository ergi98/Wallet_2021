import { useState, ReactChild, createContext } from "react";

interface ContextInterface {
	error: string;
	handleError?: (a: any) => void;
}

interface PropsInterface {
	children: ReactChild;
}

const ErrorContext = createContext<ContextInterface>({
	error: "",
});

export function ErrorProvider({ children }: PropsInterface) {
	const [error, setError] = useState<string>("");

	function handleError(error: any): void {
		let errorMessage = error ?? "An error occurred!";
		setError(errorMessage);
	}

	return (
		<ErrorContext.Provider value={{ error, handleError }}>
			{children}
		</ErrorContext.Provider>
	);
}

export default ErrorContext;
