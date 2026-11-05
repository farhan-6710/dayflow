import 'package:flutter/material.dart';

import '../features/clients/screens/clients_screen.dart';
import '../features/dashboard/screens/dashboard_screen.dart';
import '../features/more/screens/more_screen.dart';
import '../features/projects/screens/projects_screen.dart';
import '../features/reminders/screens/reminders_screen.dart';
import '../features/tasks/screens/tasks_calendar_screen.dart';
import 'navigation/app_bottom_nav.dart';
import 'navigation/app_destinations.dart';
import 'navigation/app_drawer.dart';
import 'navigation/fading_page.dart';

/// Holds the bottom bar and drawer. Pages stay alive so they keep their state between tabs.
class AppShell extends StatefulWidget {
  const AppShell({
    super.key,
    required this.themeMode,
    required this.onThemeChanged,
    required this.onSignOut,
  });

  final ThemeMode themeMode;
  final ValueChanged<ThemeMode> onThemeChanged;
  final VoidCallback onSignOut;

  @override
  State<AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<AppShell> {
  AppDestination _current = AppDestination.home;

  void _open(AppDestination destination) =>
      setState(() => _current = destination);

  Widget _page(AppDestination destination) {
    return switch (destination) {
      AppDestination.home => const DashboardScreen(),
      AppDestination.tasks => const TasksCalendarScreen(),
      AppDestination.projects => const ProjectsScreen(),
      AppDestination.clients => const ClientsScreen(),
      AppDestination.more => MoreScreen(
        themeMode: widget.themeMode,
        onThemeChanged: widget.onThemeChanged,
      ),
      AppDestination.reminders => const RemindersScreen(),
    };
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: AppDrawer(
        current: _current,
        onSignOut: widget.onSignOut,
        onSelect: (destination) {
          Navigator.of(context).pop();
          _open(destination);
        },
      ),
      body: Stack(
        children: [
          for (final destination in AppDestination.values)
            FadingPage(
              active: destination == _current,
              child: _page(destination),
            ),
        ],
      ),
      bottomNavigationBar: AppBottomNav(current: _current, onSelect: _open),
    );
  }
}
