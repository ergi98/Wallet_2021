import { useContext } from "react";
import ErrorContext from "../context/ErrorProvider";

function useError() {
	return useContext(ErrorContext);
}

export default useError;
