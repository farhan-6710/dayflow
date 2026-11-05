import 'package:flutter/material.dart';

import '../../core/constants/sample_data/reminders_data.dart';
import '../../core/theme/app_text_styles.dart';
import '../../core/theme/app_theme_extension.dart';

/// The seven repeat days. Filled means the reminder repeats that day.
class WeekdayChips extends StatelessWidget {
  const WeekdayChips({super.key, required this.days});

  final List<bool> days;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Semantics(
      label: 'Repeats on ${days.where((on) => on).length} days a week',
      excludeSemantics: true,
      child: Wrap(
        spacing: 7,
        runSpacing: 6,
        children: [
          for (final (index, on) in days.indexed)
            Container(
              width: 36,
              height: 36,
              alignment: Alignment.center,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: on ? palette.primary : Colors.transparent,
                border: on ? null : Border.all(color: palette.border),
              ),
              child: Text(
                RemindersData.dayLetters[index],
                style: AppTextStyles.bodySmall.copyWith(
                  color: on ? palette.primaryForeground : palette.foreground,
                ),
              ),
            ),
        ],
      ),
    );
  }
}
