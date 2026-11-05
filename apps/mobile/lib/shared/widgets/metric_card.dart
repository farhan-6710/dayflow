import 'package:flutter/material.dart';

import '../../core/constants/app_dimensions.dart';
import '../../core/theme/app_text_styles.dart';
import '../../core/theme/app_theme_extension.dart';
import '../../core/widgets/app_card.dart';
import '../models/metric_item.dart';

class MetricCard extends StatelessWidget {
  const MetricCard({super.key, required this.item, this.roundTile = false});

  final MetricItem item;

  /// Circle icon tile (Projects, Clients) instead of the Dashboard's rounded square.
  final bool roundTile;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    final tile = switch (item.tone) {
      MetricTone.neutral => palette.tileNeutral,
      MetricTone.warm => palette.tileWarm,
      MetricTone.amber => palette.tileAmber,
    };
    return AppCard(
      padding: const EdgeInsets.all(AppSpace.md),
      child: Row(
        children: [
          Container(
            width: 50,
            height: 50,
            decoration: BoxDecoration(
              color: tile,
              borderRadius: BorderRadius.circular(
                roundTile ? AppRadius.pill : AppRadius.tile,
              ),
            ),
            child: Icon(item.icon, size: 24, color: palette.foreground),
          ),
          const SizedBox(width: AppSpace.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.label,
                  overflow: TextOverflow.ellipsis,
                  style: AppTextStyles.bodySmall.copyWith(
                    color: palette.mutedForeground,
                    fontSize: 14,
                  ),
                ),
                Text(
                  item.value,
                  style: AppTextStyles.metricValue.copyWith(
                    color: palette.foreground,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
