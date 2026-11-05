import 'package:flutter/material.dart';

import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/sample_data/clients_data.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/theme/app_theme_extension.dart';
import '../../../core/widgets/app_row_menu.dart';
import '../../../core/widgets/app_status_chip.dart';
import '../../../shared/models/client_item.dart';
import '../../../shared/widgets/item_form_sheet.dart';

class ClientListItem extends StatelessWidget {
  const ClientListItem({super.key, required this.client});

  final ClientItem client;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Padding(
      padding: const EdgeInsets.fromLTRB(AppSpace.lg, 10, AppSpace.xs, 10),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: 2,
              children: [
                Text(
                  client.company,
                  overflow: TextOverflow.ellipsis,
                  style: AppTextStyles.cardTitle.copyWith(
                    color: palette.foreground,
                  ),
                ),
                Text(
                  client.contact,
                  overflow: TextOverflow.ellipsis,
                  style: AppTextStyles.bodySmall.copyWith(
                    fontSize: 14,
                    color: palette.mutedForeground,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: AppSpace.sm),
          AppStatusChip(label: client.isActive ? 'Active' : 'Inactive'),
          AppRowMenu(
            itemName: client.company,
            onEdit: () => showItemFormSheet(
              context,
              title: 'Edit client',
              fields: ClientsData.formFields,
            ),
          ),
        ],
      ),
    );
  }
}
