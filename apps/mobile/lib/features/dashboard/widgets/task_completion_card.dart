import 'package:flutter/material.dart';

import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/sample_data/dashboard_data.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/theme/app_theme_extension.dart';
import '../../../core/widgets/app_card.dart';
import '../../../core/widgets/app_section_header.dart';
import 'completion_chart.dart';
import 'completion_legend.dart';

class TaskCompletionCard extends StatefulWidget {
  const TaskCompletionCard({super.key});

  @override
  State<TaskCompletionCard> createState() => _TaskCompletionCardState();
}

class _TaskCompletionCardState extends State<TaskCompletionCard> {
  String _month = DashboardData.months.first;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return AppCard(
      padding: const EdgeInsets.all(AppSpace.lg),
      child: Column(
        children: [
          AppSectionHeader(
            title: 'Task completion',
            trailing: PopupMenuButton<String>(
              tooltip: 'Choose month',
              onSelected: (month) => setState(() => _month = month),
              itemBuilder: (_) => [
                for (final m in DashboardData.months)
                  PopupMenuItem(value: m, child: Text(m)),
              ],
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: AppSpace.md,
                  vertical: 7,
                ),
                decoration: BoxDecoration(
                  border: Border.all(color: palette.border),
                  borderRadius: BorderRadius.circular(AppRadius.control),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  spacing: AppSpace.xs,
                  children: [
                    Text(
                      _month,
                      style: AppTextStyles.bodySmall.copyWith(
                        color: palette.foreground,
                      ),
                    ),
                    Icon(
                      Icons.expand_more_rounded,
                      size: 18,
                      color: palette.foreground,
                    ),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(height: AppSpace.xl),
          const CompletionChart(),
          const SizedBox(height: AppSpace.lg),
          const CompletionLegend(),
        ],
      ),
    );
  }
}
