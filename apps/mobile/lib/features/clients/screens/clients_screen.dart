import 'package:flutter/material.dart';

import '../../../app/navigation/app_scaffold.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/sample_data/clients_data.dart';
import '../../../core/widgets/app_card.dart';
import '../../../core/widgets/app_empty_state.dart';
import '../../../core/widgets/app_icon_button.dart';
import '../../../core/widgets/app_search_field.dart';
import '../../../core/widgets/app_toast.dart';
import '../../../shared/widgets/item_form_sheet.dart';
import '../../../shared/widgets/metric_grid.dart';
import '../../../shared/widgets/status_filter_row.dart';
import '../widgets/client_list_item.dart';

class ClientsScreen extends StatefulWidget {
  const ClientsScreen({super.key});

  @override
  State<ClientsScreen> createState() => _ClientsScreenState();
}

class _ClientsScreenState extends State<ClientsScreen> {
  StatusFilter _filter = StatusFilter.all;
  String _query = '';

  @override
  Widget build(BuildContext context) {
    final query = _query.toLowerCase();
    final clients = ClientsData.clients.where((client) {
      final matchesFilter = switch (_filter) {
        StatusFilter.all => true,
        StatusFilter.active => client.isActive,
        StatusFilter.inactive => !client.isActive,
      };
      return matchesFilter &&
          '${client.company} ${client.contact} ${client.email}'
              .toLowerCase()
              .contains(query);
    }).toList();
    return AppScaffold(
      title: 'Clients',
      actions: [
        AppIconButton(
          icon: Icons.search_rounded,
          label: 'Search clients',
          onPressed: () => showAppToast(context, 'Use the search field below'),
        ),
        AppAddButton(
          label: 'New client',
          onPressed: () => showItemFormSheet(
            context,
            title: 'New client',
            fields: ClientsData.formFields,
          ),
        ),
      ],
      children: [
        const MetricGrid(items: ClientsData.metrics, roundTile: true),
        const SizedBox(height: AppSpace.md),
        AppSearchField(
          hint: 'Search clients, company or email...',
          onChanged: (value) => setState(() => _query = value),
        ),
        const SizedBox(height: AppSpace.md),
        StatusFilterRow(
          allLabel: 'All Clients',
          total: ClientsData.totalCount,
          active: ClientsData.activeCount,
          selected: _filter,
          onSelect: (filter) => setState(() => _filter = filter),
        ),
        const SizedBox(height: AppSpace.md),
        if (clients.isEmpty)
          const AppEmptyState(
            icon: Icons.group_off_outlined,
            title: 'No clients',
            message: 'Nothing matches this search or filter.',
          )
        else
          AppCard(
            child: Column(
              children: [
                for (final (index, client) in clients.indexed) ...[
                  if (index > 0) const Divider(),
                  ClientListItem(client: client),
                ],
              ],
            ),
          ),
      ],
    );
  }
}
