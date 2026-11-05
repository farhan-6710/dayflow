import 'package:flutter/material.dart';

import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/sample_data/tasks_data.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/theme/app_theme_extension.dart';
import '../../../core/utils/date_formatters.dart';
import 'calendar_day_cell.dart';

class MonthCalendarGrid extends StatelessWidget {
  const MonthCalendarGrid({
    super.key,
    required this.month,
    required this.selected,
    required this.onSelect,
  });

  final DateTime month;
  final DateTime selected;
  final ValueChanged<DateTime> onSelect;

  /// Whole weeks covering the month, Sunday first.
  List<List<DateTime>> _weeks() {
    final first = DateTime(month.year, month.month);
    final days = DateTime(month.year, month.month + 1, 0).day;
    final count = ((first.weekday % 7 + days) / 7).ceil();
    return [
      for (var w = 0; w < count; w++)
        [
          for (var d = 0; d < 7; d++)
            DateTime(
              month.year,
              month.month,
              1 - first.weekday % 7 + w * 7 + d,
            ),
        ],
    ];
  }

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Column(
      children: [
        Row(
          children: [
            for (final name in DateFormatters.weekdays)
              Expanded(
                child: Text(
                  name,
                  textAlign: TextAlign.center,
                  style: AppTextStyles.bodySmall.copyWith(
                    color: palette.foreground,
                  ),
                ),
              ),
          ],
        ),
        const SizedBox(height: AppSpace.md),
        for (final week in _weeks())
          Padding(
            padding: const EdgeInsets.only(bottom: AppSpace.xs),
            child: Row(
              children: [
                for (final date in week)
                  Expanded(
                    child: CalendarDayCell(
                      day: date.day,
                      dots: TasksData.dotsFor(date),
                      inMonth: date.month == month.month,
                      selected: DateFormatters.sameDay(date, selected),
                      onTap: () => onSelect(date),
                    ),
                  ),
              ],
            ),
          ),
      ],
    );
  }
}
