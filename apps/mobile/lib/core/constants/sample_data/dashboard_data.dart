import 'package:flutter/material.dart';

import '../../../shared/models/metric_item.dart';
import '../../../shared/models/todo_item.dart';

abstract final class DashboardData {
  static const greeting = 'Good Afternoon,';
  static const userName = 'Demo User';
  static const dateLabel = 'Thu, Nov 5';

  static const metrics = [
    MetricItem(
      label: 'Pending',
      value: '14',
      icon: Icons.check_circle_outline_rounded,
    ),
    MetricItem(
      label: 'Overdue',
      value: '14',
      icon: Icons.hourglass_empty_rounded,
      tone: MetricTone.warm,
    ),
    MetricItem(label: 'Projects', value: '15', icon: Icons.layers_outlined),
    MetricItem(
      label: 'Completed',
      value: '604',
      icon: Icons.check_circle_outline_rounded,
      tone: MetricTone.amber,
    ),
  ];

  static const months = ['Nov 2026', 'Oct 2026', 'Sep 2026'];
  static const chartMax = 8.0;
  static const chartTicks = [8, 4];
  static const chartLabels = ['Nov 1', 'Nov 8', 'Nov 15', 'Nov 22', 'Nov 29'];

  static const completedSeries = <double>[
    4,
    7,
    8,
    6,
    4,
    5.5,
    6.5,
    5.5,
    2.5,
    2,
    4,
    7,
    8,
    5.5,
    5,
    5.8,
    3,
    2.5,
    5.5,
    8,
    6,
    6.5,
    8,
    5,
    2.5,
    3.5,
    8,
    6.5,
    4,
    3,
    6.5,
    5,
    3,
    6,
    5,
    0,
  ];
  static const previousSeries = <double>[
    5,
    6,
    4,
    3.5,
    3.5,
    5,
    2,
    4.5,
    3.5,
    4.5,
    3.5,
    3,
    5.5,
    6,
    5,
    3.5,
    3.5,
    2.5,
    4,
    6,
    6,
    3.5,
    3.8,
    5,
    4.5,
    4,
    3.8,
    5,
    4,
    2.8,
    6,
    3.5,
    3.5,
    3.3,
  ];

  static const completedTotal = '152';
  static const previousTotal = '129';
  static const change = '+18%';

  static const todos = [
    TodoItem(title: 'Send invoice to Eat Rite', details: 'October site upkeep'),
    TodoItem(
      title: 'Review Saptagiri homepage',
      details: 'Check the new menu section',
    ),
    TodoItem(
      title: 'Renew Mantoor domain',
      details: 'Expires next week',
      done: true,
    ),
  ];

  static const insights = [
    ('Completed this week', '12'),
    ('Completed last week', '9'),
    ('Due this week', '18'),
    ('Busiest day', 'Thursday'),
  ];

  static const activity = [
    ('Open client tasks', '6'),
    ('Open meetings', '2'),
    ('Open calls', '3'),
  ];

  static const timerDisplay = '00:00:00';
}
