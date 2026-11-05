import 'package:flutter/material.dart';

import '../../../core/constants/app_dimensions.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/theme/app_theme_extension.dart';
import 'google_mark.dart';

class SignInActions extends StatelessWidget {
  const SignInActions({super.key, required this.onContinue});

  final VoidCallback onContinue;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    final shape = RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(AppRadius.control),
    );
    const size = Size(double.infinity, AppSizes.tapTarget);
    return Column(
      spacing: AppSpace.md,
      children: [
        FilledButton(
          onPressed: onContinue,
          style: FilledButton.styleFrom(minimumSize: size, shape: shape),
          child: const Text('Sign in'),
        ),
        Row(
          spacing: AppSpace.md,
          children: [
            const Expanded(child: Divider()),
            Text(
              'or',
              style: AppTextStyles.bodySmall.copyWith(
                color: palette.mutedForeground,
              ),
            ),
            const Expanded(child: Divider()),
          ],
        ),
        OutlinedButton.icon(
          onPressed: onContinue,
          style: OutlinedButton.styleFrom(
            minimumSize: size,
            shape: shape,
            foregroundColor: palette.foreground,
            backgroundColor: palette.card,
            side: BorderSide(color: palette.border),
          ),
          icon: const GoogleMark(),
          label: const Text('Continue with Google'),
        ),
        FilledButton.icon(
          onPressed: onContinue,
          style: FilledButton.styleFrom(
            minimumSize: size,
            shape: shape,
            backgroundColor: palette.success,
            foregroundColor: palette.successForeground,
          ),
          iconAlignment: IconAlignment.end,
          icon: const Icon(Icons.arrow_forward_rounded, size: 20),
          label: const Text('Continue with demo account'),
        ),
        Wrap(
          alignment: WrapAlignment.center,
          crossAxisAlignment: WrapCrossAlignment.center,
          children: [
            Text(
              'New here?',
              style: AppTextStyles.bodySmall.copyWith(
                fontSize: 14,
                color: palette.mutedForeground,
              ),
            ),
            TextButton(
              onPressed: () {},
              style: TextButton.styleFrom(foregroundColor: palette.foreground),
              child: Text(
                'Create an account',
                style: AppTextStyles.bodySmall.copyWith(
                  fontSize: 14,
                  decoration: TextDecoration.underline,
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
