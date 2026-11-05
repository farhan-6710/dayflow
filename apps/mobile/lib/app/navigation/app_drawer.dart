import 'package:flutter/material.dart';

import '../../core/constants/app_assets.dart';
import '../../core/constants/app_dimensions.dart';
import '../../core/constants/app_strings.dart';
import '../../core/theme/app_text_styles.dart';
import '../../core/theme/app_theme_extension.dart';
import 'app_destinations.dart';

/// Lists every destination, in the web sidebar's look. This is how Daily Reminders is reached.
class AppDrawer extends StatelessWidget {
  const AppDrawer({
    super.key,
    required this.current,
    required this.onSelect,
    required this.onSignOut,
  });

  final AppDestination current;
  final ValueChanged<AppDestination> onSelect;
  final VoidCallback onSignOut;

  static const _order = [
    AppDestination.home,
    AppDestination.tasks,
    AppDestination.projects,
    AppDestination.clients,
    AppDestination.reminders,
    AppDestination.more,
  ];

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Drawer(
      backgroundColor: palette.card,
      child: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(AppSpace.md),
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(
                AppSpace.xs,
                AppSpace.sm,
                0,
                AppSpace.lg,
              ),
              child: Row(
                spacing: AppSpace.sm,
                children: [
                  Image.asset(
                    isDark ? AppAssets.logoDark : AppAssets.logoLight,
                    width: 36,
                    height: 36,
                  ),
                  Text(
                    AppStrings.appName,
                    style: AppTextStyles.pageTitle.copyWith(
                      color: palette.foreground,
                    ),
                  ),
                ],
              ),
            ),
            for (final item in _order)
              _DrawerRow(
                destination: item,
                selected: item == current,
                onTap: () => onSelect(item),
              ),
            const Divider(height: AppSpace.xxl),
            ListTile(
              onTap: onSignOut,
              leading: Icon(Icons.logout_rounded, color: palette.foreground),
              title: Text(
                'Sign out',
                style: AppTextStyles.body.copyWith(color: palette.foreground),
              ),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(AppRadius.control),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _DrawerRow extends StatelessWidget {
  const _DrawerRow({
    required this.destination,
    required this.selected,
    required this.onTap,
  });

  final AppDestination destination;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    final color = selected ? palette.primaryForeground : palette.foreground;
    return Padding(
      padding: const EdgeInsets.only(bottom: AppSpace.xs),
      child: Material(
        color: selected ? palette.primary : Colors.transparent,
        borderRadius: BorderRadius.circular(AppRadius.control),
        child: ListTile(
          onTap: onTap,
          selected: selected,
          leading: Icon(destination.icon, color: color),
          title: Text(
            destination.drawerLabel,
            style: AppTextStyles.body.copyWith(color: color),
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppRadius.control),
          ),
        ),
      ),
    );
  }
}
