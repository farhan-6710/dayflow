import 'package:flutter/material.dart';

import '../constants/app_dimensions.dart';
import '../theme/app_text_styles.dart';
import '../theme/app_theme_extension.dart';

/// A label above an input. Whatever is typed stays on the screen and goes nowhere.
class AppTextField extends StatelessWidget {
  const AppTextField({
    super.key,
    required this.label,
    this.hint,
    this.obscure = false,
    this.suffix,
    this.keyboardType,
  });

  final String label;
  final String? hint;
  final bool obscure;
  final Widget? suffix;
  final TextInputType? keyboardType;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    final border = OutlineInputBorder(
      borderRadius: BorderRadius.circular(AppRadius.control),
      borderSide: BorderSide(color: palette.border),
    );
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: AppSpace.sm,
      children: [
        Text(
          label,
          style: AppTextStyles.bodySmall.copyWith(
            fontSize: 14,
            color: palette.foreground,
          ),
        ),
        TextField(
          obscureText: obscure,
          keyboardType: keyboardType,
          style: AppTextStyles.body.copyWith(color: palette.foreground),
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: AppTextStyles.body.copyWith(
              color: palette.mutedForeground,
            ),
            suffixIcon: suffix,
            filled: true,
            fillColor: palette.card,
            contentPadding: const EdgeInsets.symmetric(
              horizontal: AppSpace.md,
              vertical: 14,
            ),
            border: border,
            enabledBorder: border,
            focusedBorder: border.copyWith(
              borderSide: BorderSide(color: palette.primary),
            ),
          ),
        ),
      ],
    );
  }
}
