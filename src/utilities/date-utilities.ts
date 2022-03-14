import { parse, isDate } from "date-fns";

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

export { convertToUTC, isValidDate, parseDateString };
