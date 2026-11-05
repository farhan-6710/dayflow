import 'package:flutter/material.dart';

import '../constants/app_dimensions.dart';
import '../theme/app_text_styles.dart';
import '../theme/app_theme_extension.dart';

class AppSearchField extends StatelessWidget {
  const AppSearchField({super.key, required this.hint, this.onChanged});

  final String hint;
  final ValueChanged<String>? onChanged;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    final border = OutlineInputBorder(
      borderRadius: BorderRadius.circular(AppRadius.control),
      borderSide: BorderSide(color: palette.border),
    );
    return SizedBox(
      height: 44,
      child: TextField(
        onChanged: onChanged,
        style: AppTextStyles.bodySmall.copyWith(color: palette.foreground),
        decoration: InputDecoration(
          hintText: hint,
          hintStyle: AppTextStyles.bodySmall.copyWith(
            color: palette.mutedForeground,
          ),
          prefixIcon: Icon(
            Icons.search_rounded,
            size: 20,
            color: palette.foreground,
          ),
          filled: true,
          fillColor: palette.card,
          contentPadding: EdgeInsets.zero,
          border: border,
          enabledBorder: border,
          focusedBorder: border.copyWith(
            borderSide: BorderSide(color: palette.primary),
          ),
        ),
      ),
    );
  }
}
