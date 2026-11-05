import 'package:flutter/material.dart';

import '../../../core/constants/app_dimensions.dart';
import '../widgets/auth_brand_header.dart';
import '../widgets/demo_account_card.dart';
import '../widgets/sign_in_form.dart';

class SignInScreen extends StatefulWidget {
  const SignInScreen({super.key, required this.onContinue});

  final VoidCallback onContinue;

  @override
  State<SignInScreen> createState() => _SignInScreenState();
}

class _SignInScreenState extends State<SignInScreen> {
  bool _showDemo = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(AppSpace.page),
          children: [
            const AuthBrandHeader(),
            const SizedBox(height: AppSpace.lg),
            AnimatedSize(
              duration: const Duration(milliseconds: 180),
              child: _showDemo
                  ? Padding(
                      padding: const EdgeInsets.only(bottom: AppSpace.lg),
                      child: DemoAccountCard(
                        onDismiss: () => setState(() => _showDemo = false),
                      ),
                    )
                  : const SizedBox(width: double.infinity),
            ),
            SignInForm(onContinue: widget.onContinue),
          ],
        ),
      ),
    );
  }
}
