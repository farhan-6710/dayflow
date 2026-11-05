import 'package:flutter/material.dart';

import '../../../core/constants/app_dimensions.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/theme/app_theme_extension.dart';
import '../../../core/widgets/app_text_field.dart';
import 'sign_in_actions.dart';

class SignInForm extends StatefulWidget {
  const SignInForm({super.key, required this.onContinue});

  /// Moves to the app. There is no real sign-in in this milestone.
  final VoidCallback onContinue;

  @override
  State<SignInForm> createState() => _SignInFormState();
}

class _SignInFormState extends State<SignInForm> {
  bool _hidden = true;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const AppTextField(
          label: 'Email',
          hint: 'you@company.com',
          keyboardType: TextInputType.emailAddress,
        ),
        const SizedBox(height: AppSpace.lg),
        AppTextField(
          label: 'Password',
          obscure: _hidden,
          suffix: IconButton(
            tooltip: _hidden ? 'Show password' : 'Hide password',
            onPressed: () => setState(() => _hidden = !_hidden),
            icon: Icon(
              _hidden
                  ? Icons.visibility_outlined
                  : Icons.visibility_off_outlined,
              color: palette.mutedForeground,
            ),
          ),
        ),
        const SizedBox(height: AppSpace.xs),
        TextButton(
          onPressed: () {},
          style: TextButton.styleFrom(
            padding: EdgeInsets.zero,
            foregroundColor: palette.mutedForeground,
          ),
          child: Text(
            'Forgot password?',
            style: AppTextStyles.bodySmall.copyWith(
              fontSize: 14,
              decoration: TextDecoration.underline,
            ),
          ),
        ),
        const SizedBox(height: AppSpace.sm),
        SignInActions(onContinue: widget.onContinue),
      ],
    );
  }
}
