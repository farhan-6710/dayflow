import 'package:flutter/material.dart';

/// Where the app can go. Daily Reminders has no tab, and opens from the drawer.
enum AppDestination {
  home('Home', 'Dashboard', Icons.home_outlined),
  tasks('Tasks', 'Tasks Calendar', Icons.check_box_outlined),
  projects('Projects', 'Projects', Icons.folder_outlined),
  clients('Clients', 'Clients', Icons.group_outlined),
  more('More', 'More', Icons.notes_rounded),
  reminders('Reminders', 'Daily Reminders', Icons.event_repeat_outlined);

  const AppDestination(this.tabLabel, this.drawerLabel, this.icon);

  final String tabLabel;
  final String drawerLabel;
  final IconData icon;

  static const tabs = [home, tasks, projects, clients, more];
}
