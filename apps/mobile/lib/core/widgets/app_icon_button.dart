import 'package:flutter/material.dart';

import '../constants/app_dimensions.dart';
import '../theme/app_theme_extension.dart';

/// A plain icon with a full-size tap area and a screen reader label.
class AppIconButton extends StatelessWidget {
  const AppIconButton({
    super.key,
    required this.icon,
    required this.label,
    required this.onPressed,
    this.size = 24,
  });

  final IconData icon;
  final String label;
  final VoidCallback onPressed;
  final double size;

  @override
  Widget build(BuildContext context) {
    return IconButton(
      onPressed: onPressed,
      tooltip: label,
      iconSize: size,
      color: context.palette.foreground,
      constraints: const BoxConstraints.tightFor(
        width: AppSizes.tapTarget,
        height: AppSizes.tapTarget,
      ),
      padding: EdgeInsets.zero,
      icon: Icon(icon),
    );
  }
}

/// The dark rounded `+` in the top bars.
class AppAddButton extends StatelessWidget {
  const AppAddButton({super.key, required this.label, required this.onPressed});

  final String label;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Semantics(
      button: true,
      label: label,
      child: InkResponse(
        onTap: onPressed,
        radius: AppSizes.tapTarget / 2,
        child: SizedBox.square(
          dimension: AppSizes.tapTarget,
          child: Center(
            child: Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: palette.primary,
                borderRadius: BorderRadius.circular(11),
              ),
              child: Icon(
                Icons.add_rounded,
                color: palette.primaryForeground,
                size: 24,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
