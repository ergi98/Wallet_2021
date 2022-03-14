const genderList = [
  { text: "Male", value: "M" },
  { text: "Female", value: "F" },
  { text: "Transgender", value: "TG" },
  { text: "Non-binary/non-conforming", value: "NB/C" },
];

function isObjectEmpty(obj: Object): boolean {
  let isEmpty = false;
  if (
    obj &&
    Object.keys(obj).length === 0 &&
    Object.getPrototypeOf(obj) === Object.prototype
  )
    isEmpty = true;
  return isEmpty;
}

function isStringEmpty(str: string): boolean {
  let isEmpty = false;
  if (str?.trim() === "") isEmpty = true;
  return isEmpty;
}

export { genderList, isObjectEmpty, isStringEmpty };
