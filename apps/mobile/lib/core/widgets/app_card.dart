import 'package:flutter/material.dart';

import '../constants/app_dimensions.dart';
import '../theme/app_theme_extension.dart';

/// The standard raised surface: thin border, soft shadow, 16 radius.
class AppCard extends StatelessWidget {
  const AppCard({
    super.key,
    required this.child,
    this.padding = EdgeInsets.zero,
  });

  final Widget child;
  final EdgeInsetsGeometry padding;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Container(
      padding: padding,
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
        color: palette.card,
        borderRadius: BorderRadius.circular(AppRadius.card),
        border: Border.all(color: palette.border),
        boxShadow: AppShadows.card,
      ),
      child: child,
    );
  }
}
