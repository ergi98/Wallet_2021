import { isDate, getDate, getMonth, getYear, isValid } from "date-fns";

const months = [
	"Jan",
	"Feb",
	"March",
	"April",
	"May",
	"June",
	"July",
	"Aug",
	"Sept",
	"Oct",
	"Nov",
	"Dec",
];

function isTodayDate(date: string): Boolean {
	let dateObject = new Date(date);
	if (isDate(dateObject)) {
		return isValid(dateObject);
	} else return false;
}

function parseDateString(parsedValue: Object, value: string) {
	let date = new Date(value);
	const parsedDate = isDate(date) ? date : null;
	return parsedDate;
}

function formatDate(date: string, format: string = "short"): string {
	let dateObject = new Date(date);
	if (isDate(dateObject)) {
		let day = getDate(dateObject).toString().padStart(2, "0");
		let month = getMonth(dateObject);
		let year = getYear(dateObject);

		let time = getTimeFromDateString(date);

		return format === "short"
			? `${day} ${months[month]} ${year}`
			: `${time} ${day} ${months[month]} ${year}`;
	} else return "";
}

function getTimeFromDateString(date: string) {
	let time = "";
	let dateObject = new Date(date);
	if (isDate(dateObject)) {
		let hours = dateObject.getHours().toString().padStart(2, "0");
		let minutes = dateObject.getMinutes().toString().padStart(2, "0");
		return `${hours}:${minutes}`;
	}
	return time;
}

function getStartOfDay(date: string, type: string) {
	let dateObject = new Date(date);
	if (isDate(dateObject)) {
		/**
		 * UTC - UTC time will be start of day -> User time will be start of day + timezone
		 * Locale - User time will be start of day -> UTC time will be local time - timezone
		 */
		type === "utc"
			? dateObject.setUTCHours(0, 0, 0, 0)
			: dateObject.setHours(0, 0, 0, 0);
		return dateObject;
	} else throw new Error("Invalid Date");
}

export {
	isDate,
	formatDate,
	isTodayDate,
	getStartOfDay,
	parseDateString,
	getTimeFromDateString,
};
