// Big Number
import BigNumber from "bignumber.js";

const HighPrecisionBN = BigNumber.clone({
	DECIMAL_PLACES: 6,
	ROUNDING_MODE: 4,
});

const NormalPrecisionBN = BigNumber.clone({
	DECIMAL_PLACES: 2,
	ROUNDING_MODE: 4,
});

function roundNumber(number: number, digits: number): number {
	return (
		Math.round((number + Number.EPSILON) * Math.pow(10, digits)) /
		Math.pow(10, digits)
	);
}

function separateWithSpaces(value: string): string {
	let initialArray = value.split("");
	let initialLen = initialArray.length;
	if (!initialLen) return value;

	let formattedArray = [];
	let count = -1;
	for (let i = initialLen - 1; i >= 0; i--) {
		count++;
		if (count % 3 === 0) formattedArray.push(" ");
		formattedArray.push(initialArray[i]);
	}
	return formattedArray.reverse().join("").trim();
}

function formatAmount(amount: string, delimiter = ".") {
	let parts = amount.split(delimiter);
	let completePartSplit;
	let decimalPart;
	// Adding spaces every 3 digits
	if (parts[0] && parts[0].length)
		completePartSplit = separateWithSpaces(parts[0]);
	if (parts[1] && parts[1].length) decimalPart = parts[1];
	return {
		complete: completePartSplit,
		decimal: decimalPart,
	};
}

function getRate(prevRateToALL: number, currRateToALL: number): number {
	const prevBig = new HighPrecisionBN(prevRateToALL.toString(), 10);
	const currBig = new HighPrecisionBN(currRateToALL.toString(), 10);
	return prevBig.dividedBy(currBig).toNumber();
}

function convert(amount: number, rate: number) {
	const rateBig = new HighPrecisionBN(rate.toString(), 10);
	const amountBig = new NormalPrecisionBN(amount.toString(), 10);
	return amountBig.times(rateBig).precision(2).toNumber();
}

export { convert, getRate, roundNumber, formatAmount, separateWithSpaces };
