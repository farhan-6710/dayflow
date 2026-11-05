import 'package:flutter/material.dart';

import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/sample_data/tasks_data.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/theme/app_theme_extension.dart';
import '../../../core/widgets/app_card.dart';
import '../../../core/widgets/app_row_menu.dart';
import '../../../core/widgets/app_status_chip.dart';
import '../../../shared/models/task_item.dart';
import '../../../shared/widgets/item_form_sheet.dart';

class TaskListItem extends StatelessWidget {
  const TaskListItem({super.key, required this.task});

  final TaskItem task;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return AppCard(
      padding: const EdgeInsets.fromLTRB(
        AppSpace.lg,
        AppSpace.md,
        AppSpace.xs,
        AppSpace.md,
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 76,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: AppSpace.xs,
              children: [
                Text(
                  task.start,
                  style: AppTextStyles.bodySmall.copyWith(
                    fontSize: 14,
                    color: palette.foreground,
                  ),
                ),
                Text(
                  task.end,
                  style: AppTextStyles.bodySmall.copyWith(
                    fontSize: 14,
                    color: palette.mutedForeground,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: AppSpace.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: AppSpace.sm,
              children: [
                Text(
                  task.title,
                  style: AppTextStyles.cardTitle.copyWith(
                    color: palette.foreground,
                  ),
                ),
                AppStatusChip(
                  label: task.status,
                  showDot: true,
                  outlined: true,
                ),
              ],
            ),
          ),
          AppRowMenu(
            itemName: task.title,
            onEdit: () => showItemFormSheet(
              context,
              title: 'Edit task',
              fields: TasksData.formFields,
            ),
          ),
        ],
      ),
    );
  }
}
