import 'package:flutter/material.dart';

import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/sample_data/dashboard_data.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/theme/app_theme_extension.dart';
import '../../../core/widgets/app_card.dart';
import '../../../core/widgets/app_section_header.dart';

/// A static timer. Start and Reset are visual only.
class TimeTrackerCard extends StatelessWidget {
  const TimeTrackerCard({super.key});

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    final shape = RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(AppRadius.control),
    );
    return AppCard(
      padding: const EdgeInsets.all(AppSpace.lg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionHeader(title: 'Time tracker'),
          const SizedBox(height: AppSpace.md),
          Text(
            DashboardData.timerDisplay,
            style: AppTextStyles.greeting.copyWith(
              fontSize: 34,
              color: palette.foreground,
              fontFeatures: const [FontFeature.tabularFigures()],
            ),
          ),
          const SizedBox(height: AppSpace.lg),
          Row(
            spacing: AppSpace.sm,
            children: [
              FilledButton.icon(
                onPressed: () {},
                style: FilledButton.styleFrom(
                  minimumSize: const Size(0, AppSizes.tapTarget),
                  shape: shape,
                ),
                icon: const Icon(Icons.play_arrow_rounded),
                label: const Text('Start'),
              ),
              OutlinedButton.icon(
                onPressed: null,
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size(0, AppSizes.tapTarget),
                  shape: shape,
                ),
                icon: const Icon(Icons.replay_rounded),
                label: const Text('Reset'),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
