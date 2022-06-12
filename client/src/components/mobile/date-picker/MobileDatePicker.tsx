import {
	useRef,
	useState,
	useEffect,
	useCallback,
	useLayoutEffect,
} from "react";

// MUI
import { CalendarPickerView } from "@mui/lab";
import { Button, Divider, Stack, Typography } from "@mui/material";

// Date fns
import { isDate } from "date-fns/esm";

interface PropsInterface {
	value: string;
	label: string;
	view?: CalendarPickerView;
	onChange: (a: Date | null, b: boolean) => void;
}

interface YearProps {
	years: Array<number>;
	selected: number;
	fetch: (a: "prev" | "next") => void;
}

interface PickerProps {
	view: string;
}

const currYear = new Date().getFullYear();

function initialYearRange(): Array<number> {
	const currYear = new Date().getFullYear();
	const years = [currYear];
	for (let i = 1; i < 10; i++) {
		years.push(currYear + i);
		years.push(currYear - i);
	}
	years.sort((a, b) => a - b);
	return years;
}

function getMoreYears(
	currentYears: Array<number>,
	direction: "prev" | "next"
): Array<number> {
	const temp = [...currentYears];
	let startingYear, multiplier;
	if (direction === "prev") {
		startingYear = currentYears[0];
		multiplier = -1;
	} else {
		startingYear = currentYears[currentYears.length - 1];
		multiplier = 1;
	}
	// Get 50 more years
	for (let i = 1; i < 50; i++) {
		const next = startingYear - multiplier * i;
		temp.push(next);
	}
	temp.sort((a, b) => a - b);
	return temp;
}

function YearsView({ fetch, years }: YearProps) {
	const listRef = useRef<HTMLUListElement>(null);
	const currentYearRef = useRef<HTMLLIElement>(null);
	const lastElementRef = useRef<HTMLLIElement>(null);
	const firstElementRef = useRef<HTMLLIElement>(null);
	const observer = useRef<IntersectionObserver>();

	if (currentYearRef.current) {
		currentYearRef.current.scrollIntoView({
			block: "center",
		});
	}
	if (listRef.current) listRef.current.focus();

	// useEffect(() => {
	// 	const currentList = listRef.current;
	// 	const currentLast = lastElementRef.current;
	// 	const currentFirst = firstElementRef.current;

	// 	function handleIntersection(entries: Array<any>) {
	// 		entries.forEach((entry) => {
	// 			if (entry.isIntersecting) {
	// 				if (entry.target.id === "first") fetch("prev");
	// 				else if (entry.target.id === "last") fetch("next");
	// 			}
	// 		});
	// 	}

	// 	function addIntersectObserver() {
	// 		if (!currentList || !currentFirst || !currentLast) return;
	// 		const options = {
	// 			root: currentList,
	// 			rootMargin: "500px 0px",
	// 			threshold: 1.0,
	// 		};
	// 		observer.current = new IntersectionObserver(handleIntersection, options);
	// 		observer.current.observe(currentFirst);
	// 		observer.current.observe(currentLast);
	// 	}

	// 	addIntersectObserver();

	// 	return () => {
	// 		if (currentList && observer.current && currentFirst && currentLast) {
	// 			observer.current.unobserve(currentFirst);
	// 			observer.current.unobserve(currentLast);
	// 			observer.current = undefined;
	// 		}
	// 	};
	// }, [fetch]);

	return (
		<ul ref={listRef} className="h-64 overflow-auto snap-y snap-mandatory">
			{/* Selector Ribbon */}
			<div className="absolute w-full h-14 bg-blue-500 top-1/2 -translate-y-1/2 opacity-10"></div>
			<li ref={firstElementRef} id="first" />
			{years.map((year) => (
				<li
					ref={year === currYear ? currentYearRef : null}
					className={`h-14 snap-center flex items-center justify-center ${
						year === currYear ? "text-blue-400" : ""
					}`}
					key={year}
				>
					{year}
				</li>
			))}
			<li ref={lastElementRef} id="last" />
		</ul>
	);
}

function Picker(props: PickerProps) {
	const [year, setYear] = useState(() => currYear);
	const [yearsArray, setYearsArray] = useState(() => initialYearRange());

	const getYears = useCallback((direction: "prev" | "next") => {
		setYearsArray((prev) => getMoreYears(prev, direction));
	}, []);

	return (
		<div className="w-full">
			<YearsView years={yearsArray} selected={year} fetch={getYears} />
		</div>
	);
}

function MobileDatePicker(props: PropsInterface) {
	const [localValue, setLocalValue] = useState<Date | null>(null);
	const [currentView, setCurrentView] = useState<CalendarPickerView>(
		props.view ?? "year"
	);

	useEffect(() => {
		function initialSetup() {
			let parsedDate = new Date(props.value);
			setLocalValue(isDate(parsedDate) ? parsedDate : null);
		}
		initialSetup();
	}, [props.value]);

	function handleChange(event: any) {
		setLocalValue(event);
		currentView === "year" && setCurrentView("day");
	}

	const handleViewChange = (event: CalendarPickerView) => setCurrentView(event);

	const submitDate = () => props.onChange(localValue, true);

	const clearDate = () => setLocalValue(null);

	return (
		<div className="pb-env">
			<div className="pb-4">
				<div className="p-3">
					<Typography>{props.label}</Typography>
					<Divider />
				</div>
				<Picker view={currentView} />
				<Divider className="pt-3 px-3" />
				<Stack className="pt-3 px-3" direction="row">
					<Button onClick={clearDate} variant="text" fullWidth>
						Clear
					</Button>
					<Button onClick={submitDate} variant="contained" fullWidth>
						Done
					</Button>
				</Stack>
			</div>
		</div>
	);
}

export default MobileDatePicker;
