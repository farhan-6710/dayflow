import 'package:flutter/material.dart';

import '../constants/app_dimensions.dart';
import '../theme/app_theme_extension.dart';
import 'app_confirm_dialog.dart';
import 'app_toast.dart';

/// The three dots on a row or card: Edit, and Delete with a confirmation.
class AppRowMenu extends StatelessWidget {
  const AppRowMenu({super.key, required this.itemName, required this.onEdit});

  final String itemName;
  final VoidCallback onEdit;

  Future<void> _confirmDelete(BuildContext context) async {
    final confirmed = await showAppConfirmDialog(
      context,
      title: 'Delete "$itemName"?',
      message: "This can't be undone.",
      confirmLabel: 'Delete',
    );
    if (confirmed && context.mounted) {
      showAppToast(context, 'Preview only: nothing was deleted');
    }
  }

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return PopupMenuButton<String>(
      tooltip: 'Actions for $itemName',
      icon: Icon(Icons.more_vert_rounded, size: 22, color: palette.foreground),
      color: palette.card,
      surfaceTintColor: Colors.transparent,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppRadius.control),
      ),
      constraints: const BoxConstraints(minWidth: 140),
      padding: EdgeInsets.zero,
      onSelected: (action) =>
          action == 'Edit' ? onEdit() : _confirmDelete(context),
      itemBuilder: (_) => const [
        PopupMenuItem(
          value: 'Edit',
          child: ListTile(
            leading: Icon(Icons.edit_outlined),
            title: Text('Edit'),
            contentPadding: EdgeInsets.zero,
          ),
        ),
        PopupMenuItem(
          value: 'Delete',
          child: ListTile(
            leading: Icon(Icons.delete_outline_rounded),
            title: Text('Delete'),
            contentPadding: EdgeInsets.zero,
          ),
        ),
      ],
    );
  }
}
