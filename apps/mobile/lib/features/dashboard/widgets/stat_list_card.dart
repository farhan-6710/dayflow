import 'package:flutter/material.dart';

import '../../../core/constants/app_dimensions.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/theme/app_theme_extension.dart';
import '../../../core/widgets/app_card.dart';
import '../../../core/widgets/app_section_header.dart';

/// A titled list of label and value rows: Weekly insights and Activity snapshot.
class StatListCard extends StatelessWidget {
  const StatListCard({super.key, required this.title, required this.rows});

  final String title;
  final List<(String, String)> rows;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return AppCard(
      padding: const EdgeInsets.all(AppSpace.lg),
      child: Column(
        children: [
          AppSectionHeader(title: title),
          const SizedBox(height: AppSpace.sm),
          for (final (label, value) in rows)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: AppSpace.sm),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      label,
                      style: AppTextStyles.bodySmall.copyWith(
                        fontSize: 14,
                        color: palette.mutedForeground,
                      ),
                    ),
                  ),
                  Text(
                    value,
                    style: AppTextStyles.body.copyWith(
                      color: palette.foreground,
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
