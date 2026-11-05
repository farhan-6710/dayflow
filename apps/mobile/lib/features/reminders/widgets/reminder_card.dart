import 'package:flutter/material.dart';

import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/sample_data/reminders_data.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/theme/app_theme_extension.dart';
import '../../../core/widgets/app_card.dart';
import '../../../core/widgets/app_row_menu.dart';
import '../../../shared/models/reminder_item.dart';
import '../../../shared/widgets/item_form_sheet.dart';
import '../../../shared/widgets/weekday_chips.dart';

class ReminderCard extends StatelessWidget {
  const ReminderCard({super.key, required this.reminder});

  final ReminderItem reminder;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return AppCard(
      padding: const EdgeInsets.fromLTRB(
        AppSpace.lg,
        AppSpace.lg,
        AppSpace.xs,
        AppSpace.lg,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 56,
                height: 56,
                decoration: BoxDecoration(
                  color: palette.tileWarm,
                  borderRadius: BorderRadius.circular(AppRadius.tile),
                ),
                child: RotationTransition(
                  turns: AlwaysStoppedAnimation(reminder.iconTurns),
                  child: Icon(
                    reminder.icon,
                    size: 28,
                    color: palette.foreground,
                  ),
                ),
              ),
              const SizedBox(width: AppSpace.md),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  spacing: AppSpace.xs,
                  children: [
                    Text(
                      reminder.title,
                      style: AppTextStyles.cardTitle.copyWith(
                        color: palette.foreground,
                      ),
                    ),
                    Text(
                      reminder.description,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: AppTextStyles.bodySmall.copyWith(
                        fontSize: 14,
                        color: palette.mutedForeground,
                      ),
                    ),
                  ],
                ),
              ),
              AppRowMenu(
                itemName: reminder.title,
                onEdit: () => showItemFormSheet(
                  context,
                  title: 'Edit reminder',
                  fields: RemindersData.formFields,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpace.md),
          Row(
            spacing: AppSpace.sm,
            children: [
              Icon(
                Icons.event_note_outlined,
                size: 19,
                color: palette.foreground,
              ),
              Text(
                reminder.next,
                style: AppTextStyles.bodySmall.copyWith(
                  fontSize: 14,
                  color: palette.foreground,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpace.md),
          WeekdayChips(days: reminder.days),
        ],
      ),
    );
  }
}
