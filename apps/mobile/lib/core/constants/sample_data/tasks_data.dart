import '../../../shared/models/task_item.dart';

abstract final class TasksData {
  static const formFields = ['Title', 'Start time', 'End time'];

  /// The fixed "today" of the sample data.
  static final today = DateTime(2026, 11, 5);

  /// How many status dots each day of November 2026 shows.
  static const _dotsByDay = {1: 2, 4: 2, 7: 2, 12: 2};

  static const _tasks = [
    TaskItem(
      start: '2:00 PM',
      end: '3:00 PM',
      title: 'Clean the kitchen',
      status: 'Completed',
    ),
    TaskItem(
      start: '6:30 PM',
      end: '7:30 PM',
      title: 'Stretch a bit',
      status: 'Completed',
    ),
    TaskItem(
      start: '8:00 PM',
      end: '9:00 PM',
      title: 'Plan tomorrow',
      status: 'Completed',
    ),
    TaskItem(
      start: '9:00 PM',
      end: '9:30 PM',
      title: 'Reply to client emails',
      status: 'Completed',
    ),
    TaskItem(
      start: '9:30 PM',
      end: '10:00 PM',
      title: 'Read for a while',
      status: 'Completed',
    ),
    TaskItem(
      start: '10:00 PM',
      end: '10:30 PM',
      title: 'Prepare work clothes',
      status: 'Completed',
    ),
  ];

  static bool _inSampleMonth(DateTime date) =>
      date.year == 2026 && date.month == 11;

  static int dotsFor(DateTime date) =>
      _inSampleMonth(date) ? (_dotsByDay[date.day] ?? 3) : 0;

  /// Today has all the sample tasks. Other days in the month show a few.
  static List<TaskItem> tasksFor(DateTime date) {
    if (!_inSampleMonth(date)) return const [];
    return date.day == today.day ? _tasks : _tasks.take(dotsFor(date)).toList();
  }
}
