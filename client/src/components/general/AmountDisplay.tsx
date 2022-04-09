import { useState, useEffect } from "react";

// Utilities
import { roundNumber } from "../../utilities/math-utilities";

interface PropsInterface {
	amount: number;
	suffix?: string;
	currency?: string;
	className?: string;
	wholeClass?: string;
	decimalClass?: string;
}

function AmountDisplay(props: PropsInterface) {
	const [completePart, setCompletePart] = useState<string>("");
	const [decimalPart, setDecimalPart] = useState<string>("");

	useEffect(() => {
		let stringAmount = roundNumber(props.amount, 2).toString();

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

		if (stringAmount) {
			let amountParts = stringAmount.split(".");
			if (amountParts[0] && amountParts[0].length) {
				// Adding spaces every 3 digits
				let completePartSplit = separateWithSpaces(amountParts[0]);
				setCompletePart(completePartSplit);
			}
			if (amountParts[1] && amountParts[1].length) {
				setDecimalPart(amountParts[1]);
			} else setDecimalPart("00");
		}
	}, [props.amount]);
	return (
		<div className={props.className}>
			{props.currency && <span className="pr-1">{props.currency}</span>}
			<span className={props.wholeClass || "text-5xl"}>
				{`${completePart}.`}
			</span>
			<span className={props.decimalClass || "text-3xl"}>
				{`${decimalPart}${props.suffix ? ` ${props.suffix}` : ""}`}
			</span>
		</div>
	);
}

export default AmountDisplay;
