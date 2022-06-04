import React, { KeyboardEvent, useMemo, useState } from "react";

// MUI
import { InputAdornment, InputBase } from "@mui/material";

// Icons
import { ArrowDropDown } from "@mui/icons-material";

// Interfaces
import { Currency } from "../../interfaces/currency-interface";

// Redux
import { useAppSelector } from "../../redux_store/hooks";

// Utilities
import { convert, formatAmount, getRate } from "../../utilities/math-utilities";

// Components
import BottomDialog from "./BottomDialog";
import MobileSelect from "../mobile/select/MobileSelect";

interface PropsInterface {
	amount: number;
	currency: string;
	touched: boolean | undefined;
	amountError: string | undefined;
	onAmountTouch: () => void;
	onAmountChange: (a: number) => void;
	onCurrencyChange: (a: string) => void;
}

const specialChars = ["Tab", "Backspace"];

function AmountInput(props: PropsInterface) {
	const [dialog, setDialog] = useState(false);

	const [amount, setAmount] = useState("");
	const [focused, setFocused] = useState(false);

	const [amountPlaceholder, setAmountPlaceholder] = useState(() =>
		focused || amount !== "" ? "" : "Amount"
	);

	const currencies = useAppSelector((state) => state.currency.currencies);

	const currencyOptions = useMemo(
		() =>
			currencies.map((currency) => {
				return { text: currency.acronym, value: currency._id };
			}),
		[currencies]
	);

	const findCurrency = (currencyId: string) =>
		currencies.find((curr) => curr._id === currencyId);

	const [currency, setCurrency] = useState<Currency | undefined>(() => {
		return findCurrency(props.currency);
	});

	function getDelimiter(value: string) {
		let delimiter = "";
		if (value.includes(".")) delimiter = ".";
		else if (value.includes(",")) delimiter = ",";
		return delimiter;
	}

	function handleInput(event: any) {
		const data = getParsedAmount(event.target.value);
		setLocalAmountValue(data.original);
		props.onAmountChange(data.amount);
	}

	function getParsedAmount(amount: string): {
		amount: number;
		original: string;
		stringAmount: string;
	} {
		const unformattedAmount = amount.replaceAll(" ", "");
		const delimiter = getDelimiter(unformattedAmount);
		let parsedAmount;
		let hasReplaced = false;
		if (delimiter === ",") {
			parsedAmount = Number(unformattedAmount.replaceAll(",", "."));
			hasReplaced = true;
		} else {
			parsedAmount = Number(unformattedAmount);
		}
		const amountValue = isNaN(parsedAmount) ? 0 : parsedAmount;
		const stringAmount = hasReplaced
			? amountValue.toString().replaceAll(".", ",")
			: amountValue.toString();
		return {
			stringAmount,
			amount: amountValue,
			original: unformattedAmount,
		};
	}

	function setLocalAmountValue(value: string) {
		const delimiter = getDelimiter(value);
		const { complete, decimal } = formatAmount(value, delimiter || ".");
		if (complete !== undefined && decimal !== undefined) {
			setAmount(`${complete}${delimiter}${decimal}`);
		} else if (complete !== undefined) {
			setAmount(`${complete}${delimiter}`);
		} else setAmount("");
	}

	function handleKeyDown(event: KeyboardEvent) {
		const value = event.key;
		const delimiter = getDelimiter(amount);
		const isValidDelimiter = [",", "."].includes(value);
		// Can only input numbers
		const isValidNumber = !isNaN(Number(value));
		// Can use either , or . not both
		const isSpecialChar = specialChars.includes(value);
		if (
			!isValidNumber &&
			(!isValidDelimiter || (isValidDelimiter && delimiter !== "")) &&
			!isSpecialChar
		)
			event.preventDefault();
	}

	function handleBlur() {
		setFocused(false);
		setTimeout(() => setAmountPlaceholder(amount === "" ? "Amount" : ""), 150);
		const data = getParsedAmount(amount);
		setLocalAmountValue(data.stringAmount);
		props.onAmountChange(data.amount);
	}

	function handleFocus() {
		setFocused(true);
		props.onAmountTouch();
		setAmountPlaceholder("");
	}

	const hasError = Boolean(props.amountError) && Boolean(props.touched);

	const labelClasses = Boolean(!focused && amount === "")
		? "top-1/2 opacity-0"
		: "top-0 text-xs bg-white opacity-1";

	const infoTextClasses = hasError ? "top-0" : "-top-1/2";

	const errorClasses = hasError ? "text-red-500" : "";

	function handleCurrencyChange(event: Array<string> | string) {
		const newCurrency = findCurrency(event as string);
		if (newCurrency) {
			convertAmount(currency, newCurrency);
			setCurrency(newCurrency);
			props.onCurrencyChange(newCurrency._id);
		}
		setDialog(false);
	}

	function convertAmount(
		current: Currency | undefined,
		next: Currency | undefined
	) {
		if (!current || !next || current._id === next._id) return;
		const conversionRate = getRate(current.rateToDefault, next.rateToDefault);
		if (props.amount) {
			const newAmount = convert(props.amount, conversionRate);
			if (newAmount) {
				props.onAmountChange(newAmount);
				setLocalAmountValue(newAmount.toString());
			}
		}
	}

	return (
		<>
			<div className="w-full">
				<div
					className={`flex items-center w-full rounded-md border transition-all cursor-pointer h-10 ${
						hasError ? "border-red-500" : ""
					}`}
				>
					<InputBase
						value={currency ? currency.acronym : ""}
						endAdornment={
							<InputAdornment position="end" className="cursor-pointer">
								<ArrowDropDown />
							</InputAdornment>
						}
						inputProps={{
							sx: {
								cursor: "pointer",
							},
						}}
						onClick={() => setDialog(true)}
						className="w-28 h-full rounded-tl-md rounded-bl-md px-2 border-r"
						readOnly
						required
					/>
					<div className="relative">
						<div
							className={`absolute text-gray-400 left-2 -translate-y-1/2 transition-all ${labelClasses} ${errorClasses}`}
						>
							Amount
						</div>
						<InputBase
							value={amount}
							error={hasError}
							onBlur={handleBlur}
							onInput={handleInput}
							onFocus={handleFocus}
							onKeyDown={handleKeyDown}
							placeholder={amountPlaceholder}
							inputProps={{
								sx: {
									paddingBottom: 0,
									color: hasError ? "#ef4444" : "inherit",
								},
								className: "transition-all",
							}}
							inputMode="decimal"
							autoComplete="off"
							className="p-2"
							name="amount"
							size="small"
							type="text"
							fullWidth
							required
						/>
					</div>
				</div>
				<div className="leading-none min-h-[20px] relative">
					<span
						className={`absolute left-3 pt-1 text-xs text-red-500 transition-all ${infoTextClasses}`}
					>
						{hasError && props.amountError}
					</span>
				</div>
			</div>
			{dialog && (
				<BottomDialog
					open={dialog}
					closeOnSwipe={true}
					onClose={() => setDialog(false)}
				>
					<MobileSelect
						search={true}
						options={currencyOptions}
						label={"Select Currency"}
						value={currency ? currency._id : ""}
						onChange={handleCurrencyChange}
					/>
				</BottomDialog>
			)}
		</>
	);
}

export default AmountInput;
