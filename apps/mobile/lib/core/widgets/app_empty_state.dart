import 'package:flutter/material.dart';

import '../constants/app_dimensions.dart';
import '../theme/app_text_styles.dart';
import '../theme/app_theme_extension.dart';

class AppEmptyState extends StatelessWidget {
  const AppEmptyState({
    super.key,
    required this.icon,
    required this.title,
    required this.message,
  });

  final IconData icon;
  final String title;
  final String message;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Padding(
      padding: const EdgeInsets.symmetric(
        vertical: AppSpace.xxl,
        horizontal: AppSpace.lg,
      ),
      child: Column(
        spacing: AppSpace.sm,
        children: [
          Icon(icon, size: 36, color: palette.mutedForeground),
          Text(
            title,
            style: AppTextStyles.cardTitle.copyWith(color: palette.foreground),
          ),
          Text(
            message,
            textAlign: TextAlign.center,
            style: AppTextStyles.bodySmall.copyWith(
              color: palette.mutedForeground,
            ),
          ),
        ],
      ),
    );
  }
}
