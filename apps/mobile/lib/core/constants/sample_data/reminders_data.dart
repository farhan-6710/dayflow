import 'package:flutter/material.dart';

import '../../../shared/models/reminder_item.dart';

abstract final class RemindersData {
  static const formFields = ['Title', 'Description (optional)', 'Time'];
  static const dayLetters = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  static const _everyDay = [true, true, true, true, true, true, true];
  static const _exceptSunday = [true, true, true, true, true, true, false];
  static const _weekdays = [true, true, true, true, true, false, false];

  static const reminders = [
    ReminderItem(
      title: 'Morning Workout',
      description: "Complete today's training session and log how it felt before starting work.",
      next: 'Next: Tomorrow, 7:00 AM',
      icon: Icons.fitness_center_rounded,
      iconTurns: -0.125,
      days: _exceptSunday,
    ),
    ReminderItem(
      title: 'Lunch Time',
      description: 'Step away from the desk, eat a proper meal, and take a short walk after.',
      next: 'Next: Tomorrow, 1:12 PM',
      icon: Icons.restaurant_rounded,
      days: _exceptSunday,
    ),
    ReminderItem(
      title: "Log Today's Harmony Work",
      description: 'Update Harmony with the office work completed today before wrapping up.',
      next: 'Next: Today, 6:00 PM',
      icon: Icons.laptop_outlined,
      days: _weekdays,
    ),
    ReminderItem(
      title: 'Dinner Time',
      description:
          'Sit down for dinner and keep it off screens until the meal is done.',
      next: 'Next: Today, 9:30 PM',
      icon: Icons.dinner_dining_outlined,
      days: _everyDay,
    ),
  ];
}
