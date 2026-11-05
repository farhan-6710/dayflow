import 'package:flutter/material.dart';

import '../../core/constants/app_dimensions.dart';
import '../../core/widgets/app_filter_pill.dart';

enum StatusFilter { all, active, inactive }

/// All, Active and Inactive pills that run off the screen edge and scroll sideways.
class StatusFilterRow extends StatelessWidget {
  const StatusFilterRow({
    super.key,
    required this.allLabel,
    required this.total,
    required this.active,
    required this.selected,
    required this.onSelect,
  });

  final String allLabel;
  final int total;
  final int active;
  final StatusFilter selected;
  final ValueChanged<StatusFilter> onSelect;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        return SizedBox(
          height: 44,
          child: OverflowBox(
            maxWidth: constraints.maxWidth + AppSpace.page * 2,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: AppSpace.page),
              children: [
                _pill(allLabel, total, StatusFilter.all),
                const SizedBox(width: AppSpace.sm),
                _pill('Active', active, StatusFilter.active),
                const SizedBox(width: AppSpace.sm),
                _pill('Inactive', total - active, StatusFilter.inactive),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _pill(String label, int count, StatusFilter filter) {
    return AppFilterPill(
      label: label,
      count: count,
      selected: selected == filter,
      onTap: () => onSelect(filter),
    );
  }
}
