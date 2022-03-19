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

function convertToUTC(date: Date): Date {
  var utcDate = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
  return new Date(utcDate);
}

function isTodayDate(date: string): Boolean {
  let dateObject = new Date(date);
  if (isValidDate(dateObject)) {
    return isValid(dateObject);
  } else return false;
}

function isValidDate(date: any): Boolean {
  let isValid = false;
  if (Object.prototype.toString.call(date) === "[object Date]") {
    if (!isNaN(date)) isValid = true;
  }
  return isValid;
}

function parseDateString(parsedValue: Object, value: string) {
  const parsedDate = isDate(value) ? value : null;
  return parsedDate;
}

function formatDate(date: string, format: string = "short"): string {
  let dateObject = new Date(date);
  if (isValidDate(dateObject)) {
    let day = getDate(dateObject);
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
  if (isValidDate(dateObject)) {
    let hours = dateObject.getHours().toString().padStart(2, "0");
    let minutes = dateObject.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }
  return time;
}

export {
  formatDate,
  isTodayDate,
  isValidDate,
  convertToUTC,
  parseDateString,
  getTimeFromDateString,
};
