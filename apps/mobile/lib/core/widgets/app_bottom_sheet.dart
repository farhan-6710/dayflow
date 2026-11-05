import 'package:flutter/material.dart';

import '../constants/app_dimensions.dart';
import '../theme/app_text_styles.dart';
import '../theme/app_theme_extension.dart';

/// A sheet that stays above the keyboard and clear of the screen's safe areas.
Future<void> showAppBottomSheet(
  BuildContext context, {
  required String title,
  required Widget child,
}) {
  final palette = context.palette;
  return showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    useSafeArea: true,
    showDragHandle: true,
    backgroundColor: palette.card,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
    ),
    builder: (sheetContext) => Padding(
      padding: EdgeInsets.only(
        bottom: MediaQuery.viewInsetsOf(sheetContext).bottom,
      ),
      child: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(
          AppSpace.lg,
          0,
          AppSpace.lg,
          AppSpace.xl,
        ),
        child: SafeArea(
          top: false,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: AppTextStyles.sectionTitle.copyWith(
                  color: palette.foreground,
                ),
              ),
              const SizedBox(height: AppSpace.lg),
              child,
            ],
          ),
        ),
      ),
    ),
  );
}
