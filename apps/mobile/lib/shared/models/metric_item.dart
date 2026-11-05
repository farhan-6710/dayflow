import 'package:flutter/material.dart';

enum MetricTone { neutral, warm, amber }

/// One summary number with its icon.
class MetricItem {
  const MetricItem({
    required this.label,
    required this.value,
    required this.icon,
    this.tone = MetricTone.neutral,
  });

  final String label;
  final String value;
  final IconData icon;
  final MetricTone tone;
}
