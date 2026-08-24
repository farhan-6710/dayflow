import { useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";

import {
  buildCalendarDateSearchParams,
  buildMonthWeeks,
  parseCalendarDateFromSearchParams,
  toCalendarParts,
} from "@/features/reminders/utils/calendarUtils";

function resolveSelectedDate(searchParams: URLSearchParams): Date {
  return parseCalendarDateFromSearchParams(searchParams) ?? new Date();
}

export function useRemindersCalendarSelection() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (parseCalendarDateFromSearchParams(searchParams)) return;

    setSearchParams(buildCalendarDateSearchParams(new Date(), searchParams), {
      replace: true,
    });
  }, [searchParams, setSearchParams]);

  const selectedDate = useMemo(
    () => resolveSelectedDate(searchParams),
    [searchParams],
  );

  const { year, month } = useMemo(
    () => toCalendarParts(selectedDate),
    [selectedDate],
  );

  const calendarWeeks = useMemo(
    () => buildMonthWeeks(year, month),
    [year, month],
  );

  const selectDate = useCallback(
    (date: Date) => {
      setSearchParams(buildCalendarDateSearchParams(date, searchParams), {
        replace: true,
      });
    },
    [searchParams, setSearchParams],
  );

  return {
    selectedDate,
    calendarWeeks,
    year,
    month,
    selectDate,
  };
}
