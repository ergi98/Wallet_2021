const genderList = [
	{ text: "Male", value: "M" },
	{ text: "Female", value: "F" },
	{ text: "Transgender", value: "TG" },
	{ text: "Non-binary/non-conforming", value: "NB/C" },
];

function isObjectEmpty(obj: Object): boolean {
	let isEmpty = false;
	if (
		obj &&
		Object.keys(obj).length === 0 &&
		Object.getPrototypeOf(obj) === Object.prototype
	)
		isEmpty = true;
	return isEmpty;
}

function isStringEmpty(str: string): boolean {
	let isEmpty = false;
	if (!str || str?.trim() === "") isEmpty = true;
	return isEmpty;
}

interface ResolvedValues {
	data: any;
	error: any;
}

async function withTryCatch(promiseFn: Promise<any>): Promise<ResolvedValues> {
	let res = {
		data: null,
		error: null,
	};
	try {
		let result = await promiseFn;
		res.data = result;
	} catch (err: any) {
		console.log(err);
		res.error = err?.response?.data?.message ?? "An error occurred!";
	} finally {
		return res;
	}
}

export { genderList, isObjectEmpty, isStringEmpty, withTryCatch };
