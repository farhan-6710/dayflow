export const HOUR_12_OPTIONS = Array.from({ length: 12 }, (_, index) =>
  String(index + 1),
);

export const MINUTE_OPTIONS = Array.from({ length: 60 }, (_, index) =>
  String(index).padStart(2, "0"),
);
