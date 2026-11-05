import 'package:flutter/material.dart';

import '../../../core/constants/app_dimensions.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/theme/app_theme_extension.dart';
import '../../../core/widgets/app_card.dart';
import '../../../core/widgets/app_toast.dart';
import '../../../shared/models/menu_item.dart';

/// A card of rows with thin lines between them.
class MenuGroup extends StatelessWidget {
  const MenuGroup({super.key, required this.items, required this.trailing});

  final List<MenuItem> items;
  final IconData trailing;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Column(
        children: [
          for (final (index, item) in items.indexed) ...[
            if (index > 0)
              const Divider(indent: AppSpace.lg, endIndent: AppSpace.lg),
            _MenuRow(item: item, trailing: trailing),
          ],
        ],
      ),
    );
  }
}

class _MenuRow extends StatelessWidget {
  const _MenuRow({required this.item, required this.trailing});

  final MenuItem item;
  final IconData trailing;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: () => showAppToast(context, '${item.title}: preview only'),
        child: Padding(
          padding: EdgeInsets.symmetric(
            horizontal: AppSpace.lg,
            vertical: item.subtitle == null ? 15 : 12,
          ),
          child: Row(
            children: [
              Icon(item.icon, size: 25, color: palette.foreground),
              const SizedBox(width: AppSpace.xl),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  spacing: 1,
                  children: [
                    Text(
                      item.title,
                      style: AppTextStyles.body.copyWith(
                        fontSize: 16,
                        color: palette.foreground,
                      ),
                    ),
                    if (item.subtitle != null)
                      Text(
                        item.subtitle!,
                        style: AppTextStyles.bodySmall.copyWith(
                          color: palette.mutedForeground,
                        ),
                      ),
                  ],
                ),
              ),
              Icon(
                trailing,
                size: trailing == Icons.chevron_right_rounded ? 24 : 21,
                color: palette.foreground,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
