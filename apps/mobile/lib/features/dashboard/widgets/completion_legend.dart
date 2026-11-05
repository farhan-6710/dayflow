import 'package:flutter/material.dart';

import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/sample_data/dashboard_data.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/theme/app_theme_extension.dart';

class CompletionLegend extends StatelessWidget {
  const CompletionLegend({super.key});

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Row(
      children: [
        Expanded(
          child: _LegendItem(
            color: palette.chartAccent,
            value: DashboardData.completedTotal,
            label: 'Completed',
          ),
        ),
        Expanded(
          child: _LegendItem(
            color: palette.chartPrevious,
            value: DashboardData.previousTotal,
            label: 'Previous',
          ),
        ),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
          decoration: BoxDecoration(
            color: palette.insightUpBg,
            borderRadius: BorderRadius.circular(AppRadius.pill),
            border: Border.all(color: palette.insightUpBorder),
          ),
          child: Row(
            spacing: AppSpace.xs,
            children: [
              Icon(
                Icons.north_east_rounded,
                size: 14,
                color: palette.insightUp,
              ),
              Text(
                DashboardData.change,
                style: AppTextStyles.bodySmall.copyWith(
                  color: palette.insightUp,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _LegendItem extends StatelessWidget {
  const _LegendItem({
    required this.color,
    required this.value,
    required this.label,
  });

  final Color color;
  final String value;
  final String label;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          spacing: AppSpace.sm,
          children: [
            Container(
              width: 9,
              height: 9,
              decoration: BoxDecoration(color: color, shape: BoxShape.circle),
            ),
            Text(
              value,
              style: AppTextStyles.body.copyWith(
                fontSize: 16,
                color: palette.foreground,
              ),
            ),
          ],
        ),
        Padding(
          padding: const EdgeInsets.only(left: AppSpace.lg),
          child: Text(
            label,
            style: AppTextStyles.caption.copyWith(
              color: palette.mutedForeground,
            ),
          ),
        ),
      ],
    );
  }
}
