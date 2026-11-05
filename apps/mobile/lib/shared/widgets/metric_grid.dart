import 'package:flutter/material.dart';

import '../../core/constants/app_dimensions.dart';
import '../models/metric_item.dart';
import 'metric_card.dart';

/// Metric cards, two to a row.
class MetricGrid extends StatelessWidget {
  const MetricGrid({super.key, required this.items, this.roundTile = false});

  final List<MetricItem> items;
  final bool roundTile;

  @override
  Widget build(BuildContext context) {
    return Column(
      spacing: AppSpace.md,
      children: [
        for (var i = 0; i < items.length; i += 2)
          Row(
            spacing: AppSpace.md,
            children: [
              Expanded(
                child: MetricCard(item: items[i], roundTile: roundTile),
              ),
              Expanded(
                child: i + 1 < items.length
                    ? MetricCard(item: items[i + 1], roundTile: roundTile)
                    : const SizedBox.shrink(),
              ),
            ],
          ),
      ],
    );
  }
}
