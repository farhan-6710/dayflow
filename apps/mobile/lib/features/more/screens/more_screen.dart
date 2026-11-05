import 'package:flutter/material.dart';

import '../../../app/navigation/app_scaffold.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/sample_data/more_data.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/theme/app_theme_extension.dart';
import '../widgets/menu_group.dart';
import '../widgets/profile_card.dart';
import '../widgets/theme_selector_card.dart';

class MoreScreen extends StatelessWidget {
  const MoreScreen({
    super.key,
    required this.themeMode,
    required this.onThemeChanged,
  });

  final ThemeMode themeMode;
  final ValueChanged<ThemeMode> onThemeChanged;

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: 'More',
      children: [
        const ProfileCard(),
        const SizedBox(height: AppSpace.lg),
        const MenuGroup(
          items: MoreData.menu,
          trailing: Icons.chevron_right_rounded,
        ),
        const SizedBox(height: AppSpace.lg),
        Padding(
          padding: const EdgeInsets.only(
            left: AppSpace.xs,
            bottom: AppSpace.sm,
          ),
          child: Text(
            'Portals',
            style: AppTextStyles.bodySmall.copyWith(
              color: context.palette.foreground,
            ),
          ),
        ),
        const MenuGroup(
          items: MoreData.portals,
          trailing: Icons.open_in_new_rounded,
        ),
        const SizedBox(height: AppSpace.lg),
        ThemeSelectorCard(mode: themeMode, onChanged: onThemeChanged),
      ],
    );
  }
}
