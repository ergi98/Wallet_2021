import { useState, useEffect, useRef } from "react";

// Utilities
import { roundNumber } from "../../utilities/math-utilities";

// Components
import ContentLoading from "./ContentLoading";

interface PropsInterface {
	amount: number;
	suffix?: string;
	loading?: boolean;
	currency?: string;
	className?: string;
	wholeClass?: string;
	decimalClass?: string;
}

function AmountDisplay(props: PropsInterface) {
	const [completePart, setCompletePart] = useState<string>("");
	const [decimalPart, setDecimalPart] = useState<string>("");

	const [dimensions, setDimensions] = useState({
		height: 0,
		width: 0,
	});
	const amountRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function storeElementHeight() {
			if (!amountRef.current) return;
			console.dir(amountRef.current);
			setDimensions({
				height: amountRef.current.clientHeight,
				width: amountRef.current.clientWidth,
			});
		}
		storeElementHeight();
	}, [props.amount]);

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
		<div ref={amountRef} className={props.className}>
			<ContentLoading dimensions={dimensions} loading={props.loading ?? false}>
				{props.currency && <span className="pr-1">{props.currency}</span>}
				<span className={props.wholeClass || "text-5xl"}>
					{`${completePart}.`}
				</span>
				<span className={props.decimalClass || "text-3xl"}>
					{`${decimalPart}${props.suffix ? ` ${props.suffix}` : ""}`}
				</span>
			</ContentLoading>
		</div>
	);
}

export default AmountDisplay;
