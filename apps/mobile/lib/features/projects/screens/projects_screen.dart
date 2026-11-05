import 'package:flutter/material.dart';

import '../../../app/navigation/app_scaffold.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/sample_data/projects_data.dart';
import '../../../core/widgets/app_card.dart';
import '../../../core/widgets/app_empty_state.dart';
import '../../../core/widgets/app_icon_button.dart';
import '../../../core/widgets/app_search_field.dart';
import '../../../shared/widgets/item_form_sheet.dart';
import '../../../shared/widgets/metric_grid.dart';
import '../../../shared/widgets/status_filter_row.dart';
import '../widgets/project_list_item.dart';

class ProjectsScreen extends StatefulWidget {
  const ProjectsScreen({super.key});

  @override
  State<ProjectsScreen> createState() => _ProjectsScreenState();
}

class _ProjectsScreenState extends State<ProjectsScreen> {
  StatusFilter _filter = StatusFilter.all;
  bool _searching = false;
  String _query = '';

  @override
  Widget build(BuildContext context) {
    final query = _query.toLowerCase();
    final projects = ProjectsData.projects.where((project) {
      final matchesFilter = switch (_filter) {
        StatusFilter.all => true,
        StatusFilter.active => project.isActive,
        StatusFilter.inactive => !project.isActive,
      };
      return matchesFilter &&
          '${project.name} ${project.client}'.toLowerCase().contains(query);
    }).toList();
    return AppScaffold(
      title: 'Projects',
      actions: [
        AppIconButton(
          icon: Icons.search_rounded,
          label: 'Search projects',
          onPressed: () => setState(() {
            _searching = !_searching;
            _query = '';
          }),
        ),
        AppAddButton(
          label: 'New project',
          onPressed: () => showItemFormSheet(
            context,
            title: 'New project',
            fields: ProjectsData.formFields,
          ),
        ),
      ],
      children: [
        const MetricGrid(items: ProjectsData.metrics, roundTile: true),
        const SizedBox(height: AppSpace.md),
        AnimatedSize(
          duration: const Duration(milliseconds: 180),
          child: _searching
              ? Padding(
                  padding: const EdgeInsets.only(bottom: AppSpace.md),
                  child: AppSearchField(
                    hint: 'Search projects...',
                    onChanged: (value) => setState(() => _query = value),
                  ),
                )
              : const SizedBox(width: double.infinity),
        ),
        StatusFilterRow(
          allLabel: 'All Projects',
          total: ProjectsData.totalCount,
          active: ProjectsData.activeCount,
          selected: _filter,
          onSelect: (filter) => setState(() => _filter = filter),
        ),
        const SizedBox(height: AppSpace.md),
        if (projects.isEmpty)
          const AppEmptyState(
            icon: Icons.folder_off_outlined,
            title: 'No projects',
            message: 'Nothing matches this filter.',
          )
        else
          AppCard(
            child: Column(
              children: [
                for (final (index, project) in projects.indexed) ...[
                  if (index > 0) const Divider(),
                  ProjectListItem(project: project),
                ],
              ],
            ),
          ),
      ],
    );
  }
}
