import { useState } from "react";

function getStoredContext<T>(key: string, initialValue: T): T {
  try {
    let value = localStorage.getItem(key);
    if (value) {
      let parsedValue = JSON.parse(value);
      return parsedValue;
    } else return initialValue;
  } catch (err) {
    console.log("getStoredContext", err);
    return initialValue;
  }
}

export default function useLocalContext<T>(key: string, initialValue: T) {
  const [localContext] = useState(() => getStoredContext(key, initialValue));

  function persistContext(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  return [localContext, persistContext] as const;
}
