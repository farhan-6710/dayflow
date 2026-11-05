import 'package:flutter/material.dart';

import '../../../shared/models/menu_item.dart';

abstract final class MoreData {
  static const userName = 'Demo User';
  static const userInitials = 'DU';
  static const userEmail = 'dayflow.demo@gmail.com';

  static const menu = [
    MenuItem(icon: Icons.bar_chart_rounded, title: 'Analytics'),
    MenuItem(icon: Icons.notifications_none_rounded, title: 'Notifications'),
    MenuItem(icon: Icons.person_outline_rounded, title: 'Account'),
    MenuItem(icon: Icons.settings_outlined, title: 'Settings'),
  ];

  static const portals = [
    MenuItem(
      icon: Icons.work_outline_rounded,
      title: 'Workspace Portal',
      subtitle: 'Your owner workspace',
    ),
    MenuItem(
      icon: Icons.group_outlined,
      title: 'Client Portal',
      subtitle: 'View shared projects',
    ),
  ];
}
