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

function toObject(array: Array<any>, key: string, value: string) {
	const obj = {} as any;
	for (const element of array) {
		if (element[key] !== undefined && element[value] !== undefined)
			obj[element[key]] = element[value];
	}
	return obj;
}

export { genderList, isObjectEmpty, isStringEmpty, toObject };
