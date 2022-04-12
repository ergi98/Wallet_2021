import useError from "./useError";

interface ResolvedValues {
	data: any;
	error: any;
}

function useTryCatch(): Function {
	const { handleError } = useError();
	const withTryCatch = async (
		promiseFn: Promise<any>
	): Promise<ResolvedValues> => {
		let res = {
			data: null,
			error: null,
		};
		try {
			let result = await promiseFn;
			res.data = result;
		} catch (err: any) {
			console.error(err);
			res.error = err?.response?.data?.message ?? "An error occurred!";
			handleError && handleError(res.error);
		} finally {
			return res;
		}
	};

	return withTryCatch;
}

export default useTryCatch;
