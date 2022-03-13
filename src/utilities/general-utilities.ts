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

function isEmptyString(str: string): boolean {
  let isEmpty = false;
  if (str?.trim() === "") isEmpty = true;
  return isEmpty;
}

export { isObjectEmpty, isEmptyString };
