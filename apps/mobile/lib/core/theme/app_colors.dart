import 'package:flutter/material.dart';

import 'app_theme_extension.dart';

/// Values from shared/brand/theme.json. This is the only file with theme hex values.
abstract final class AppColors {
  static const light = AppPalette(
    background: Color(0xFFE9E4D8),
    foreground: Color(0xFF1E1E1E),
    card: Color(0xFFF4EFE4),
    primary: Color(0xFF2E2E2E),
    primaryForeground: Color(0xFFE6E4D7),
    secondary: Color(0xFFD8D2C4),
    muted: Color(0xFFCFC8B8),
    mutedForeground: Color(0xFF5E5A52),
    border: Color(0xFFD2CBBB),
    accent: Color(0xFFE6E4D7),
    destructive: Color(0xFFDC2626),
    chartAccent: Color(0xFFF26A4B),
    chartPrevious: Color(0xFF5E5A52),
    success: Color(0xFF21763C),
    successForeground: Color(0xFFF6FCF6),
    successText: Color(0xFF0B5D2A),
    insightUp: Color(0xFF2E513B),
    insightUpBg: Color(0xFFDFECE1),
    insightUpBorder: Color(0xFFBDD0C0),
    insightDownBg: Color(0xFFF9E9E2),
    tileNeutral: Color(0xFFE6E4D7),
    tileWarm: Color(0xFFF8DFD0),
    tileAmber: Color(0xFFF7ECD2),
  );

  static const dark = AppPalette(
    background: Color(0xFF141414),
    foreground: Color(0xFFE8E3DA),
    card: Color(0xFF1C1C1C),
    primary: Color(0xFFD1CFC0),
    primaryForeground: Color(0xFF363636),
    secondary: Color(0xFF222222),
    muted: Color(0xFF2A2A2A),
    mutedForeground: Color(0xFF8E8A83),
    border: Color(0xFF2C2C2C),
    accent: Color(0xFF363636),
    destructive: Color(0xFFEF4444),
    chartAccent: Color(0xFFF26A4B),
    chartPrevious: Color(0xFF8E8A83),
    success: Color(0xFF3A714B),
    successForeground: Color(0xFFF0F7F2),
    successText: Color(0xFF88C999),
    insightUp: Color(0xFFA3C9AE),
    insightUpBg: Color(0xFF1C2720),
    insightUpBorder: Color(0xFF314236),
    insightDownBg: Color(0xFF2F231F),
    tileNeutral: Color(0xFF2A2A2A),
    tileWarm: Color(0xFF3A2A23),
    tileAmber: Color(0xFF2E2919),
  );
}
