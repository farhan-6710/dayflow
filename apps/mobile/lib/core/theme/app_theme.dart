import 'package:flutter/material.dart';

import 'app_colors.dart';
import 'app_text_styles.dart';
import 'app_theme_extension.dart';

abstract final class AppTheme {
  static final light = _build(AppColors.light, Brightness.light);
  static final dark = _build(AppColors.dark, Brightness.dark);

  static ThemeData _build(AppPalette p, Brightness brightness) {
    return ThemeData(
      useMaterial3: true,
      brightness: brightness,
      fontFamily: 'Ovo',
      scaffoldBackgroundColor: p.background,
      extensions: [p],
      colorScheme: ColorScheme(
        brightness: brightness,
        primary: p.primary,
        onPrimary: p.primaryForeground,
        secondary: p.secondary,
        onSecondary: p.foreground,
        error: p.destructive,
        onError: p.card,
        surface: p.card,
        onSurface: p.foreground,
        outline: p.border,
      ),
      bottomSheetTheme: BottomSheetThemeData(dragHandleColor: p.muted),
      dividerTheme: DividerThemeData(color: p.border, thickness: 1, space: 1),
      textTheme: TextTheme(
        bodyMedium: AppTextStyles.body.copyWith(
          color: p.foreground,
          letterSpacing: 0,
        ),
      ),
      splashFactory: InkSparkle.splashFactory,
    );
  }
}
