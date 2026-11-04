import { format, isValid, parse } from "date-fns";

const DATE_VALUE_FORMAT = "yyyy-MM-dd";

/** Parses a `yyyy-MM-dd` value in local time; undefined when empty or invalid. */
export function parseDateValue(value: string | null | undefined): Date | undefined {
  if (!value) {
    return undefined;
  }
  const date = parse(value, DATE_VALUE_FORMAT, new Date());
  return isValid(date) ? date : undefined;
}

export function serializeDateValue(date: Date): string {
  return format(date, DATE_VALUE_FORMAT);
}
