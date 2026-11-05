import 'package:flutter/material.dart';

import '../../../core/constants/app_assets.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/app_strings.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/theme/app_theme_extension.dart';

class AuthBrandHeader extends StatelessWidget {
  const AuthBrandHeader({super.key});

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Column(
      children: [
        Row(
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
        Image.asset(
          isDark ? AppAssets.authDark : AppAssets.authLight,
          height: 130,
          excludeFromSemantics: true,
        ),
        const SizedBox(height: AppSpace.sm),
        SizedBox(
          width: double.infinity,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            spacing: AppSpace.xs,
            children: [
              Text(
                'Sign in',
                style: AppTextStyles.greeting.copyWith(
                  color: palette.foreground,
                ),
              ),
              Text(
                'Use your email and password to open your workspace.',
                style: AppTextStyles.body.copyWith(
                  color: palette.mutedForeground,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
