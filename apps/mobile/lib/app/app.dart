import 'dart:ui';

import 'package:flutter/material.dart';

import '../core/constants/app_strings.dart';
import '../core/theme/app_theme.dart';
import '../features/auth/screens/sign_in_screen.dart';
import 'app_shell.dart';

class DayFlowApp extends StatefulWidget {
  const DayFlowApp({super.key});

  @override
  State<DayFlowApp> createState() => _DayFlowAppState();
}

class _DayFlowAppState extends State<DayFlowApp> {
  // Starts from the device. The choice on the More screen isn't saved.
  ThemeMode _mode =
      PlatformDispatcher.instance.platformBrightness == Brightness.dark
      ? ThemeMode.dark
      : ThemeMode.light;

  // Which screen shows. There is no real sign-in in this milestone.
  bool _inApp = false;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: AppStrings.appName,
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light,
      darkTheme: AppTheme.dark,
      themeMode: _mode,
      home: _inApp
          ? AppShell(
              themeMode: _mode,
              onThemeChanged: (mode) => setState(() => _mode = mode),
              onSignOut: () => setState(() => _inApp = false),
            )
          : SignInScreen(onContinue: () => setState(() => _inApp = true)),
    );
  }
}
