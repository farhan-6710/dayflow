import 'package:flutter/material.dart';

import '../../../core/constants/app_dimensions.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/theme/app_theme_extension.dart';
import '../../../core/widgets/app_card.dart';

class ThemeSelectorCard extends StatelessWidget {
  const ThemeSelectorCard({
    super.key,
    required this.mode,
    required this.onChanged,
  });

  final ThemeMode mode;
  final ValueChanged<ThemeMode> onChanged;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return AppCard(
      padding: const EdgeInsets.fromLTRB(
        AppSpace.lg,
        AppSpace.sm,
        AppSpace.sm,
        AppSpace.sm,
      ),
      child: Row(
        children: [
          Icon(Icons.light_mode_outlined, size: 24, color: palette.foreground),
          const SizedBox(width: AppSpace.md),
          Expanded(
            child: Text(
              'Theme',
              style: AppTextStyles.body.copyWith(
                fontSize: 16,
                color: palette.foreground,
              ),
            ),
          ),
          Container(
            decoration: BoxDecoration(
              color: palette.secondary,
              borderRadius: BorderRadius.circular(14),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                _Segment(
                  label: 'Light',
                  selected: mode == ThemeMode.light,
                  onTap: () => onChanged(ThemeMode.light),
                ),
                _Segment(
                  label: 'Dark',
                  selected: mode == ThemeMode.dark,
                  onTap: () => onChanged(ThemeMode.dark),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _Segment extends StatelessWidget {
  const _Segment({
    required this.label,
    required this.selected,
    required this.onTap,
  });

  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Semantics(
      button: true,
      selected: selected,
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 180),
          width: 80,
          height: 44,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: selected ? palette.primary : Colors.transparent,
            borderRadius: BorderRadius.circular(14),
          ),
          child: Text(
            label,
            style: AppTextStyles.body.copyWith(
              color: selected ? palette.primaryForeground : palette.foreground,
            ),
          ),
        ),
      ),
    );
  }
}
