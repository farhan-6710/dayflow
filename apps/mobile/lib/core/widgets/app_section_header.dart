import 'package:flutter/material.dart';

import '../theme/app_text_styles.dart';
import '../theme/app_theme_extension.dart';

/// A section title with an optional item on the right.
class AppSectionHeader extends StatelessWidget {
  const AppSectionHeader({super.key, required this.title, this.trailing});

  final String title;
  final Widget? trailing;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: Text(
            title,
            style: AppTextStyles.sectionTitle.copyWith(
              color: context.palette.foreground,
            ),
          ),
        ),
        ?trailing,
      ],
    );
  }
}
