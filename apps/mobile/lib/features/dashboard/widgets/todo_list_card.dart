import 'package:flutter/material.dart';

import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/sample_data/dashboard_data.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/theme/app_theme_extension.dart';
import '../../../core/widgets/app_card.dart';
import '../../../core/widgets/app_section_header.dart';
import '../../../shared/models/todo_item.dart';

class TodoListCard extends StatelessWidget {
  const TodoListCard({super.key});

  @override
  Widget build(BuildContext context) {
    return AppCard(
      padding: const EdgeInsets.all(AppSpace.lg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionHeader(title: 'Todo list'),
          const SizedBox(height: AppSpace.sm),
          for (final (index, todo) in DashboardData.todos.indexed) ...[
            if (index > 0) const Divider(),
            _TodoRow(todo: todo),
          ],
        ],
      ),
    );
  }
}

class _TodoRow extends StatefulWidget {
  const _TodoRow({required this.todo});

  final TodoItem todo;

  @override
  State<_TodoRow> createState() => _TodoRowState();
}

class _TodoRowState extends State<_TodoRow> {
  late bool _done = widget.todo.done;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Row(
      children: [
        Icon(
          Icons.drag_indicator_rounded,
          size: 20,
          color: palette.mutedForeground,
        ),
        Checkbox(
          value: _done,
          activeColor: palette.primary,
          checkColor: palette.primaryForeground,
          onChanged: (value) => setState(() => _done = value ?? false),
        ),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                widget.todo.title,
                style: AppTextStyles.body.copyWith(
                  color: _done ? palette.mutedForeground : palette.foreground,
                  decoration: _done ? TextDecoration.lineThrough : null,
                ),
              ),
              Text(
                widget.todo.details,
                style: AppTextStyles.caption.copyWith(
                  color: palette.mutedForeground,
                ),
              ),
            ],
          ),
        ),
        Icon(Icons.more_vert_rounded, size: 20, color: palette.foreground),
      ],
    );
  }
}
