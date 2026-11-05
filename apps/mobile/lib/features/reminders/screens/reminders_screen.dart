import 'package:flutter/material.dart';

import '../../../app/navigation/app_scaffold.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/sample_data/reminders_data.dart';
import '../../../core/widgets/app_icon_button.dart';
import '../../../shared/widgets/item_form_sheet.dart';
import '../widgets/reminder_card.dart';

class RemindersScreen extends StatelessWidget {
  const RemindersScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: 'Daily Reminders',
      actions: [
        AppAddButton(
          label: 'New reminder',
          onPressed: () => showItemFormSheet(
            context,
            title: 'New reminder',
            fields: RemindersData.formFields,
          ),
        ),
      ],
      children: [
        for (final reminder in RemindersData.reminders)
          Padding(
            padding: const EdgeInsets.only(bottom: AppSpace.md),
            child: ReminderCard(reminder: reminder),
          ),
      ],
    );
  }
}
