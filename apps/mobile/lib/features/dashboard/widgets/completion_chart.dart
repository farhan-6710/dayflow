import 'package:flutter/material.dart';

import '../../../core/constants/sample_data/dashboard_data.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/theme/app_theme_extension.dart';
import 'completion_chart_painter.dart';

/// Smooth completed line with a soft fill, over a dashed line for the previous period.
class CompletionChart extends StatelessWidget {
  const CompletionChart({super.key});

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    final labelStyle = AppTextStyles.caption.copyWith(
      color: palette.mutedForeground,
    );
    return Semantics(
      label: 'Chart of tasks completed compared with the previous period',
      child: Column(
        children: [
          SizedBox(
            height: 150,
            child: TweenAnimationBuilder<double>(
              tween: Tween(begin: 0, end: 1),
              // Reduced motion draws the chart straight away.
              duration: MediaQuery.disableAnimationsOf(context)
                  ? Duration.zero
                  : const Duration(milliseconds: 600),
              curve: Curves.easeOut,
              builder: (context, progress, _) => CustomPaint(
                size: Size.infinite,
                painter: CompletionChartPainter(
                  progress: progress,
                  accent: palette.chartAccent,
                  previous: palette.chartPrevious,
                  grid: palette.border,
                  labelStyle: labelStyle,
                ),
              ),
            ),
          ),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              for (final label in DashboardData.chartLabels)
                Text(label, style: labelStyle),
            ],
          ),
        ],
      ),
    );
  }
}
