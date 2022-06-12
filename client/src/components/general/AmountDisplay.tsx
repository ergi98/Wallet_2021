import { useState, useEffect, useRef } from "react";

// Utilities
import { formatAmount, roundNumber } from "../../utilities/math-utilities";

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
	const amountRef = useRef<HTMLDivElement>(null);

	const [dimensions, setDimensions] = useState({
		width: 0,
		height: 0,
	});
	const [decimalPart, setDecimalPart] = useState<string>("");
	const [completePart, setCompletePart] = useState<string>("");

	useEffect(() => {
		function storeElementHeight() {
			if (!amountRef.current) return;
			setDimensions({
				width: amountRef.current.clientWidth,
				height: amountRef.current.clientHeight,
			});
		}
		function formatPropsAmount() {
			let stringAmount = roundNumber(props.amount, 2).toString();
			if (!stringAmount) return;
			let { complete, decimal } = formatAmount(stringAmount);
			complete && setCompletePart(complete);
			setDecimalPart(decimal ?? "00");
		}
		storeElementHeight();
		formatPropsAmount();
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
