import { useState, useEffect, useRef } from "react";

// Utilities
import {
	formatAmount,
	roundNumber,
	separateWithSpaces,
} from "../../utilities/math-utilities";

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
			setDimensions({
				height: amountRef.current.clientHeight,
				width: amountRef.current.clientWidth,
			});
		}
		storeElementHeight();
	}, [props.amount]);

	useEffect(() => {
		let stringAmount = roundNumber(props.amount, 2).toString();
		if (stringAmount) {
			let { complete, decimal } = formatAmount(stringAmount);
			complete && setCompletePart(complete);
			setDecimalPart(decimal ?? "00");
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
