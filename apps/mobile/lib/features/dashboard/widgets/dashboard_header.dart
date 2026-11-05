import 'package:flutter/material.dart';

import '../../../core/constants/app_assets.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/sample_data/dashboard_data.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/theme/app_theme_extension.dart';

class DashboardHeader extends StatelessWidget {
  const DashboardHeader({super.key});

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          child: Padding(
            padding: const EdgeInsets.only(left: AppSpace.sm, top: AppSpace.lg),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  DashboardData.greeting,
                  style: AppTextStyles.greeting.copyWith(
                    color: palette.foreground,
                  ),
                ),
                Text(
                  DashboardData.userName,
                  style: AppTextStyles.greeting.copyWith(
                    color: palette.chartAccent,
                  ),
                ),
                const SizedBox(height: AppSpace.sm),
                Text(
                  DashboardData.dateLabel,
                  style: AppTextStyles.body.copyWith(
                    color: palette.mutedForeground,
                  ),
                ),
              ],
            ),
          ),
        ),
        Image.asset(
          AppAssets.heroPlant,
          width: 100,
          excludeFromSemantics: true,
        ),
      ],
    );
  }
}
