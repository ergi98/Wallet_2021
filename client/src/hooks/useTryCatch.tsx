interface ResolvedValues {
	data: any;
	error: any;
}

function useTryCatch(): Function {
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
		} finally {
			return res;
		}
	};

	return withTryCatch;
}

export default useTryCatch;
