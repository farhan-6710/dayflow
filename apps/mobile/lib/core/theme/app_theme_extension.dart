import 'package:flutter/material.dart';

/// Every DayFlow colour token. Widgets read these through `context.palette`.
class AppPalette extends ThemeExtension<AppPalette> {
  const AppPalette({
    required this.background,
    required this.foreground,
    required this.card,
    required this.primary,
    required this.primaryForeground,
    required this.secondary,
    required this.muted,
    required this.mutedForeground,
    required this.border,
    required this.accent,
    required this.destructive,
    required this.chartAccent,
    required this.chartPrevious,
    required this.success,
    required this.successForeground,
    required this.successText,
    required this.insightUp,
    required this.insightUpBg,
    required this.insightUpBorder,
    required this.insightDownBg,
    required this.tileNeutral,
    required this.tileWarm,
    required this.tileAmber,
  });

  final Color background;
  final Color foreground;
  final Color card;
  final Color primary;
  final Color primaryForeground;
  final Color secondary;
  final Color muted;
  final Color mutedForeground;
  final Color border;
  final Color accent;
  final Color destructive;
  final Color chartAccent;
  final Color chartPrevious;
  final Color success;
  final Color successForeground;
  final Color successText;
  final Color insightUp;
  final Color insightUpBg;
  final Color insightUpBorder;
  final Color insightDownBg;

  /// Icon tile behind neutral metrics, such as Pending.
  final Color tileNeutral;

  /// Peach icon tile for Overdue and reminders. Not in theme.json: the reference needs it.
  final Color tileWarm;

  /// Icon tile behind the Completed metric. Not in theme.json: the reference needs it.
  final Color tileAmber;

  @override
  AppPalette copyWith() => this;

  @override
  AppPalette lerp(AppPalette? other, double t) {
    if (other == null) return this;
    Color mix(Color a, Color b) => Color.lerp(a, b, t)!;
    return AppPalette(
      background: mix(background, other.background),
      foreground: mix(foreground, other.foreground),
      card: mix(card, other.card),
      primary: mix(primary, other.primary),
      primaryForeground: mix(primaryForeground, other.primaryForeground),
      secondary: mix(secondary, other.secondary),
      muted: mix(muted, other.muted),
      mutedForeground: mix(mutedForeground, other.mutedForeground),
      border: mix(border, other.border),
      accent: mix(accent, other.accent),
      destructive: mix(destructive, other.destructive),
      chartAccent: mix(chartAccent, other.chartAccent),
      chartPrevious: mix(chartPrevious, other.chartPrevious),
      success: mix(success, other.success),
      successForeground: mix(successForeground, other.successForeground),
      successText: mix(successText, other.successText),
      insightUp: mix(insightUp, other.insightUp),
      insightUpBg: mix(insightUpBg, other.insightUpBg),
      insightUpBorder: mix(insightUpBorder, other.insightUpBorder),
      insightDownBg: mix(insightDownBg, other.insightDownBg),
      tileNeutral: mix(tileNeutral, other.tileNeutral),
      tileWarm: mix(tileWarm, other.tileWarm),
      tileAmber: mix(tileAmber, other.tileAmber),
    );
  }
}

extension AppPaletteContext on BuildContext {
  AppPalette get palette => Theme.of(this).extension<AppPalette>()!;
}
