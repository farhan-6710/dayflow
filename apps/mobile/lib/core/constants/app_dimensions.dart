import 'package:flutter/material.dart';

/// Spacing scale and shapes used across the app.
abstract final class AppSpace {
  static const double xs = 4;
  static const double sm = 8;
  static const double md = 12;
  static const double lg = 16;
  static const double xl = 20;
  static const double xxl = 24;
  static const double page = 16;
}

abstract final class AppRadius {
  static const double tile = 18;
  static const double card = 16;
  static const double control = 12;
  static const double pill = 999;
}

abstract final class AppSizes {
  /// The smallest tap area for any control.
  static const double tapTarget = 48;
  static const double navItem = 60;
}

abstract final class AppShadows {
  static const card = [
    BoxShadow(color: Color(0x0D000000), blurRadius: 10, offset: Offset(0, 4)),
  ];
}
