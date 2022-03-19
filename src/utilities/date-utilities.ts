import { isDate, getDate, getMonth, getYear } from "date-fns";

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

function formatDate(date: Date): string {
  let day = getDate(date);
  let month = getMonth(date);
  let year = getYear(date);

  return `${day} ${months[month]} ${year}`;
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
  convertToUTC,
  isValidDate,
  parseDateString,
  formatDate,
  getTimeFromDateString,
};
