import 'package:flutter/material.dart';

import '../../../app/navigation/app_scaffold.dart';
import '../../../core/constants/app_assets.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/sample_data/dashboard_data.dart';
import '../../../core/widgets/app_icon_button.dart';
import '../../../core/widgets/app_toast.dart';
import '../../../shared/widgets/metric_grid.dart';
import '../widgets/dashboard_header.dart';
import '../widgets/stat_list_card.dart';
import '../widgets/task_completion_card.dart';
import '../widgets/time_tracker_card.dart';
import '../widgets/todo_list_card.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return AppScaffold(
      center: Image.asset(
        isDark ? AppAssets.logoDark : AppAssets.logoLight,
        height: 34,
        semanticLabel: 'DayFlow',
      ),
      actions: [
        AppIconButton(
          icon: Icons.notifications_none_rounded,
          label: 'Notifications',
          onPressed: () => showAppToast(context, 'Notifications: preview only'),
        ),
      ],
      children: const [
        DashboardHeader(),
        SizedBox(height: AppSpace.md),
        MetricGrid(items: DashboardData.metrics),
        SizedBox(height: AppSpace.lg),
        TaskCompletionCard(),
        SizedBox(height: AppSpace.lg),
        TodoListCard(),
        SizedBox(height: AppSpace.lg),
        StatListCard(title: 'Weekly insights', rows: DashboardData.insights),
        SizedBox(height: AppSpace.lg),
        StatListCard(title: 'Activity snapshot', rows: DashboardData.activity),
        SizedBox(height: AppSpace.lg),
        TimeTrackerCard(),
      ],
    );
  }
}
