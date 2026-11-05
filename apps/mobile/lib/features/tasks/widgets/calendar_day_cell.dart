import 'package:flutter/material.dart';

import '../../../core/constants/app_dimensions.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/theme/app_theme_extension.dart';

/// One day: its number, then a row of green status dots.
class CalendarDayCell extends StatelessWidget {
  const CalendarDayCell({
    super.key,
    required this.day,
    required this.dots,
    required this.selected,
    required this.inMonth,
    required this.onTap,
  });

  final int day;
  final int dots;
  final bool selected;
  final bool inMonth;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    final numberColor = selected
        ? palette.primaryForeground
        : inMonth
        ? palette.foreground
        : palette.mutedForeground;
    return Semantics(
      button: true,
      selected: selected,
      label: '$day, $dots tasks',
      excludeSemantics: true,
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: inMonth ? onTap : null,
        child: Container(
          height: 52,
          margin: const EdgeInsets.symmetric(horizontal: 3),
          decoration: BoxDecoration(
            color: selected ? palette.insightUpBg : Colors.transparent,
            borderRadius: BorderRadius.circular(AppRadius.control),
          ),
          child: Column(
            children: [
              AnimatedContainer(
                duration: const Duration(milliseconds: 180),
                width: 40,
                height: 36,
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: selected ? palette.primary : Colors.transparent,
                  borderRadius: BorderRadius.circular(AppRadius.control),
                ),
                child: Text(
                  '$day',
                  style: AppTextStyles.body.copyWith(color: numberColor),
                ),
              ),
              const SizedBox(height: 3),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                spacing: 2,
                children: [
                  for (var i = 0; i < dots; i++)
                    Container(
                      width: 5,
                      height: 5,
                      decoration: BoxDecoration(
                        color: palette.success,
                        shape: BoxShape.circle,
                      ),
                    ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
