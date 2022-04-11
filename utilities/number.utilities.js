/**
 *
 * @param  {...any} numbers
 * @returns {(Error | undefined)} Throws an error in case not all the params are of type number
 */
function areValidNumbers(...numbers) {
	for (let number of numbers) {
		if (typeof number !== "number" || isNaN(number))
			throw new Error(`Invalid argument types: ${number}`);
	}
}

/**
 *
 * @param {(number | string)} a
 * @param {(number | string)} b
 * @returns {Object} Returns the parsed value of a and b and the multiply value
 */
function getValues(a, b) {
	let parsedA = parseFloat(a);
	let parsedB = parseFloat(b);
	areValidNumbers(parsedA, parsedB);
	let power = getPower(parsedA, parsedB);
	let multiplyValue = Math.pow(10, power);
	return { parsedA, parsedB, multiply: multiplyValue };
}

/**
 * @param {(number | string)} a
 * @param {(number | string)} b
 * @returns {number} Returns the exact difference of a and b
 */
function exactDiff(a, b) {
	let { parsedA, parsedB, multiply } = getValues(a, b);
	return (parsedA * multiply - parsedB * multiply) / multiply;
}

/**
 * @param {(number | string)} a
 * @param {(number | string)} b
 * @returns {number} Returns the exact sum of a and b
 */
function exactSum(a, b) {
	let { parsedA, parsedB, multiply } = getValues(a, b);
	return (parsedA * multiply + parsedB * multiply) / multiply;
}

/**
 * @param {number} a
 * @param {number} b
 * @returns {number} Returns the max amount of decimal values between the given params
 */
function getPower(a, b) {
	let decimalsOfA = a.toString().split(".")[1]?.length ?? 0;
	let decimalsOfB = b.toString().split(".")[1]?.length ?? 0;
	return decimalsOfA > decimalsOfB ? decimalsOfA : decimalsOfB;
}

export { exactSum, exactDiff };
