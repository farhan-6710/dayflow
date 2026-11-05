import 'package:flutter/material.dart';

import '../../../app/navigation/app_scaffold.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/sample_data/tasks_data.dart';
import '../../../core/utils/date_formatters.dart';
import '../../../core/widgets/app_card.dart';
import '../../../core/widgets/app_empty_state.dart';
import '../../../core/widgets/app_icon_button.dart';
import '../../../core/widgets/app_toast.dart';
import '../../../shared/widgets/item_form_sheet.dart';
import '../widgets/calendar_header.dart';
import '../widgets/month_calendar_grid.dart';
import '../widgets/task_day_header.dart';
import '../widgets/task_list_item.dart';

class TasksCalendarScreen extends StatefulWidget {
  const TasksCalendarScreen({super.key});

  @override
  State<TasksCalendarScreen> createState() => _TasksCalendarScreenState();
}

class _TasksCalendarScreenState extends State<TasksCalendarScreen> {
  DateTime _selected = TasksData.today;
  DateTime _month = DateTime(TasksData.today.year, TasksData.today.month);

  void _changeMonth(int by) =>
      setState(() => _month = DateTime(_month.year, _month.month + by));

  @override
  Widget build(BuildContext context) {
    final tasks = TasksData.tasksFor(_selected);
    return AppScaffold(
      title: 'Tasks Calendar',
      actions: [
        AppIconButton(
          icon: Icons.search_rounded,
          label: 'Search tasks',
          onPressed: () => showAppToast(context, 'Search: preview only'),
        ),
        AppAddButton(
          label: 'Add task',
          onPressed: () => showItemFormSheet(
            context,
            title: 'New task',
            fields: TasksData.formFields,
          ),
        ),
      ],
      children: [
        AppCard(
          padding: const EdgeInsets.all(AppSpace.md),
          child: Column(
            children: [
              CalendarHeader(
                title: DateFormatters.monthYear(_month),
                onPrevious: () => _changeMonth(-1),
                onNext: () => _changeMonth(1),
              ),
              const SizedBox(height: AppSpace.md),
              MonthCalendarGrid(
                month: _month,
                selected: _selected,
                onSelect: (date) => setState(() => _selected = date),
              ),
            ],
          ),
        ),
        const SizedBox(height: AppSpace.xl),
        TaskDayHeader(
          title: DateFormatters.fullDay(_selected),
          count: tasks.length,
        ),
        const SizedBox(height: AppSpace.md),
        if (tasks.isEmpty)
          const AppEmptyState(
            icon: Icons.event_available_outlined,
            title: 'No tasks',
            message: 'Nothing is planned for this day.',
          ),
        for (final task in tasks)
          Padding(
            padding: const EdgeInsets.only(bottom: AppSpace.md),
            child: TaskListItem(task: task),
          ),
      ],
    );
  }
}
