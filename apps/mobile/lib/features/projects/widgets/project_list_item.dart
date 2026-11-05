import 'package:flutter/material.dart';

import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/sample_data/projects_data.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/theme/app_theme_extension.dart';
import '../../../core/widgets/app_row_menu.dart';
import '../../../shared/models/project_item.dart';
import '../../../shared/widgets/item_form_sheet.dart';

class ProjectListItem extends StatelessWidget {
  const ProjectListItem({super.key, required this.project});

  final ProjectItem project;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Padding(
      padding: const EdgeInsets.fromLTRB(
        AppSpace.md,
        AppSpace.sm,
        AppSpace.xs,
        AppSpace.sm,
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: project.color,
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.folder_outlined,
              color: Colors.white,
              size: 24,
            ),
          ),
          const SizedBox(width: AppSpace.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: 2,
              children: [
                Text(
                  project.name,
                  overflow: TextOverflow.ellipsis,
                  style: AppTextStyles.cardTitle.copyWith(
                    color: palette.foreground,
                  ),
                ),
                Text(
                  project.client,
                  overflow: TextOverflow.ellipsis,
                  style: AppTextStyles.bodySmall.copyWith(
                    fontSize: 14,
                    color: palette.mutedForeground,
                  ),
                ),
              ],
            ),
          ),
          AppRowMenu(
            itemName: project.name,
            onEdit: () => showItemFormSheet(
              context,
              title: 'Edit project',
              fields: ProjectsData.formFields,
            ),
          ),
        ],
      ),
    );
  }
}
