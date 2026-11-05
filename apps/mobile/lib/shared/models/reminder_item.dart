import 'package:flutter/material.dart';

class ReminderItem {
  const ReminderItem({
    required this.title,
    required this.description,
    required this.next,
    required this.icon,
    required this.days,
    this.iconTurns = 0,
  });

  final String title;
  final String description;
  final String next;
  final IconData icon;

  /// Rotates the icon: the Material dumbbell is diagonal, and the reference's is level.
  final double iconTurns;

  /// Which days repeat, Monday first.
  final List<bool> days;
}
