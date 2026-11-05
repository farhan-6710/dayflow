import 'package:flutter/material.dart';

import '../../core/constants/app_dimensions.dart';
import '../../core/widgets/app_bottom_sheet.dart';
import '../../core/widgets/app_text_field.dart';
import '../../core/widgets/app_toast.dart';

/// The sheet behind every `+` and Edit. Saving only closes it: nothing is stored.
void showItemFormSheet(
  BuildContext context, {
  required String title,
  required List<String> fields,
}) {
  final page = context;
  showAppBottomSheet(
    context,
    title: title,
    child: Column(
      spacing: AppSpace.lg,
      children: [
        for (final field in fields) AppTextField(label: field),
        Builder(
          builder: (sheetContext) => SizedBox(
            width: double.infinity,
            height: AppSizes.tapTarget,
            child: FilledButton(
              style: FilledButton.styleFrom(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(AppRadius.control),
                ),
              ),
              onPressed: () {
                Navigator.of(sheetContext).pop();
                showAppToast(page, 'Preview only: nothing was saved');
              },
              child: const Text('Save'),
            ),
          ),
        ),
      ],
    ),
  );
}
