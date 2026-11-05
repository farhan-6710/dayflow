/// Date text for the sample data, kept simple so no package is needed.
abstract final class DateFormatters {
  static const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  static const _months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  /// November 2026
  static String monthYear(DateTime date) =>
      '${_months[date.month - 1]} ${date.year}';

  /// Thu, 5 Nov 2026
  static String fullDay(DateTime date) {
    final weekday = weekdays[date.weekday % 7];
    return '$weekday, ${date.day} ${_months[date.month - 1].substring(0, 3)} ${date.year}';
  }

  static bool sameDay(DateTime a, DateTime b) =>
      a.year == b.year && a.month == b.month && a.day == b.day;
}
