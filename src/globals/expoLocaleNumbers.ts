import { locale } from "expo-localization";

const thousandsSeparator = (1000).toLocaleString(locale)[1] === "," ? "," : ".";
const decimalSeparator = thousandsSeparator === "." ? "," : ".";

export function parseLocaleNumber(stringNumber: string) {
  return Number(
    stringNumber
      .replace(new RegExp(`\\${thousandsSeparator}`, "g"), "")
      .replace(new RegExp(`\\${decimalSeparator}`), "."),
  );
}

export function toFixedLocale(value: number, numDigits: number) {
  const standardFixedString = value.toFixed(numDigits);
  return numStringToLocale(standardFixedString);
}

export function numberToLocaleString(value: number) {
  const str = value.toString();
  return numStringToLocale(str);
}

function numStringToLocale(numStr: string) {
  if (decimalSeparator === ",") {
    return numStr.replace(".", ",");
  } else {
    return numStr; // Locale matches JavaScript default
  }
}