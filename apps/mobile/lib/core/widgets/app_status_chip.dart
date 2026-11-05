import 'package:flutter/material.dart';

import '../constants/app_dimensions.dart';
import '../theme/app_text_styles.dart';
import '../theme/app_theme_extension.dart';

/// A green status label, such as Active or Completed.
class AppStatusChip extends StatelessWidget {
  const AppStatusChip({
    super.key,
    required this.label,
    this.showDot = false,
    this.outlined = false,
  });

  final String label;
  final bool showDot;

  /// Plain paper fill with a border, as on task cards.
  final bool outlined;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      decoration: BoxDecoration(
        color: outlined ? Colors.transparent : palette.insightUpBg,
        borderRadius: BorderRadius.circular(AppRadius.pill),
        border: Border.all(
          color: outlined ? palette.border : palette.insightUpBorder,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (showDot) ...[
            Container(
              width: 7,
              height: 7,
              decoration: BoxDecoration(
                color: palette.success,
                shape: BoxShape.circle,
              ),
            ),
            const SizedBox(width: 6),
          ],
          Text(
            label,
            style: AppTextStyles.caption.copyWith(
              color: palette.successText,
              fontSize: 13,
            ),
          ),
        ],
      ),
    );
  }
}
