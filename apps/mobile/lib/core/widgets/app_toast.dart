import 'package:flutter/material.dart';

import '../theme/app_text_styles.dart';
import '../theme/app_theme_extension.dart';

/// A short message at the bottom of the screen.
void showAppToast(BuildContext context, String message) {
  final palette = context.palette;
  ScaffoldMessenger.of(context)
    ..hideCurrentSnackBar()
    ..showSnackBar(
      SnackBar(
        behavior: SnackBarBehavior.floating,
        backgroundColor: palette.primary,
        duration: const Duration(seconds: 2),
        content: Text(
          message,
          style: AppTextStyles.bodySmall.copyWith(
            color: palette.primaryForeground,
          ),
        ),
      ),
    );
}
