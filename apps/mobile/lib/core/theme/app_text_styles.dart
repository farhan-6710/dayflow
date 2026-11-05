import 'package:flutter/material.dart';

/// Font sizes measured from the reference. Colours come from the theme.
/// Ovo and Young Serif have one weight, so nothing here sets a bold weight.
abstract final class AppTextStyles {
  static const _ovo = 'Ovo';
  static const _youngSerif = 'YoungSerif';

  /// Young Serif's default numbers dip below the line. The reference uses level ones.
  static const _lining = [FontFeature.liningFigures()];

  static const greeting = TextStyle(
    fontFamily: _youngSerif,
    fontFeatures: _lining,
    fontSize: 28,
    height: 1.2,
  );
  static const pageTitle = TextStyle(
    fontFamily: _youngSerif,
    fontFeatures: _lining,
    fontSize: 22,
    height: 1.2,
  );
  static const sectionTitle = TextStyle(
    fontFamily: _youngSerif,
    fontFeatures: _lining,
    fontSize: 19,
    height: 1.25,
  );
  static const cardTitle = TextStyle(
    fontFamily: _youngSerif,
    fontFeatures: _lining,
    fontSize: 15,
    height: 1.25,
  );
  static const metricValue = TextStyle(
    fontFamily: _youngSerif,
    fontFeatures: _lining,
    fontSize: 23,
    height: 1.15,
  );

  static const body = TextStyle(
    fontFamily: _ovo,
    letterSpacing: 0,
    fontSize: 15,
    height: 1.3,
  );
  static const bodySmall = TextStyle(
    fontFamily: _ovo,
    letterSpacing: 0,
    fontSize: 13,
    height: 1.3,
  );
  static const caption = TextStyle(
    fontFamily: _ovo,
    letterSpacing: 0,
    fontSize: 12,
    height: 1.25,
  );
  static const navLabel = TextStyle(
    fontFamily: _ovo,
    letterSpacing: 0,
    fontSize: 11.5,
    height: 1.2,
  );
}
