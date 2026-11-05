import 'package:flutter/material.dart';

import '../../../core/theme/app_text_styles.dart';
import '../../../core/theme/app_theme_extension.dart';

class TaskDayHeader extends StatelessWidget {
  const TaskDayHeader({super.key, required this.title, required this.count});

  final String title;
  final int count;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Row(
      children: [
        Expanded(
          child: Text(
            title,
            style: AppTextStyles.cardTitle.copyWith(
              fontSize: 17,
              color: palette.foreground,
            ),
          ),
        ),
        Text(
          '$count ${count == 1 ? 'task' : 'tasks'}',
          style: AppTextStyles.bodySmall.copyWith(
            color: palette.mutedForeground,
          ),
        ),
      ],
    );
  }
}
