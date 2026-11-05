import 'package:flutter/material.dart';

import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/app_strings.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/theme/app_theme_extension.dart';
import '../../../core/widgets/app_card.dart';

/// The public demo credentials, for display only. They are never submitted or checked.
class DemoAccountCard extends StatelessWidget {
  const DemoAccountCard({super.key, required this.onDismiss});

  final VoidCallback onDismiss;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return AppCard(
      padding: const EdgeInsets.fromLTRB(
        AppSpace.lg,
        AppSpace.xs,
        AppSpace.xs,
        AppSpace.md,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  'Just looking around?',
                  style: AppTextStyles.cardTitle.copyWith(
                    fontSize: 17,
                    color: palette.success,
                  ),
                ),
              ),
              IconButton(
                tooltip: 'Dismiss',
                onPressed: onDismiss,
                icon: Icon(
                  Icons.close_rounded,
                  size: 20,
                  color: palette.mutedForeground,
                ),
              ),
            ],
          ),
          _Credential(label: 'Email', value: AppStrings.demoEmail),
          _Credential(label: 'Password', value: AppStrings.demoPassword),
        ],
      ),
    );
  }
}

class _Credential extends StatelessWidget {
  const _Credential({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Row(
      children: [
        SizedBox(
          width: 76,
          child: Text(
            label,
            style: AppTextStyles.bodySmall.copyWith(
              fontSize: 14,
              color: palette.mutedForeground,
            ),
          ),
        ),
        Expanded(
          child: Text(
            value,
            style: AppTextStyles.bodySmall.copyWith(
              fontSize: 14,
              color: palette.chartAccent,
            ),
          ),
        ),
      ],
    );
  }
}
