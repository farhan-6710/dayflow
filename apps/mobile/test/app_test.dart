import 'package:dayflow/app/app.dart';
import 'package:dayflow/core/theme/app_theme.dart';
import 'package:dayflow/features/auth/screens/sign_in_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

/// Small, medium and large phones, and a tablet. Any layout overflow fails these tests.
const _sizes = {
  'small phone': Size(310, 640),
  'phone': Size(390, 844),
  'large phone': Size(430, 932),
  'tablet': Size(768, 1024),
};

Future<void> _useSize(WidgetTester tester, Size size) async {
  tester.view.devicePixelRatio = 1;
  tester.view.physicalSize = size;
  addTearDown(tester.view.reset);
}

Future<void> _enterApp(WidgetTester tester) async {
  await tester.pumpWidget(const DayFlowApp());
  await tester.pumpAndSettle();
  final demo = find.text('Continue with demo account');
  await tester.ensureVisible(demo);
  await tester.pumpAndSettle();
  await tester.tap(demo);
  await tester.pumpAndSettle();
}

/// Tests use a blocky default font, so load the real ones to measure real text widths.
Future<void> _loadFonts() async {
  await (FontLoader(
    'Ovo',
  )..addFont(rootBundle.load('fonts/Ovo-Regular.ttf'))).load();
  await (FontLoader(
    'YoungSerif',
  )..addFont(rootBundle.load('fonts/YoungSerif-Regular.ttf'))).load();
}

void main() {
  setUpAll(_loadFonts);

  for (final entry in _sizes.entries) {
    testWidgets('every tab renders on a ${entry.key}', (tester) async {
      await _useSize(tester, entry.value);
      await _enterApp(tester);
      for (final tab in ['Tasks', 'Projects', 'Clients', 'More', 'Home']) {
        await tester.tap(find.text(tab).last);
        await tester.pumpAndSettle();
        expect(tester.takeException(), isNull);
      }
    });

    for (final (name, theme) in [
      ('light', AppTheme.light),
      ('dark', AppTheme.dark),
    ]) {
      testWidgets('sign in renders in $name on a ${entry.key}', (tester) async {
        await _useSize(tester, entry.value);
        await tester.pumpWidget(
          MaterialApp(
            theme: theme,
            home: SignInScreen(onContinue: () {}),
          ),
        );
        await tester.pumpAndSettle();
        expect(tester.takeException(), isNull);
      });
    }
  }

  testWidgets('the drawer reaches Daily Reminders', (tester) async {
    await _useSize(tester, const Size(390, 844));
    await _enterApp(tester);
    await tester.tap(find.byTooltip('Open menu').first);
    await tester.pumpAndSettle();
    await tester.tap(find.text('Daily Reminders').last);
    await tester.pumpAndSettle();
    expect(find.text('Morning Workout').hitTestable(), findsOneWidget);
  });

  testWidgets('the More screen switches to dark', (tester) async {
    await _useSize(tester, const Size(390, 844));
    await _enterApp(tester);
    await tester.tap(find.text('More').last);
    await tester.pumpAndSettle();
    await tester.tap(find.text('Dark'));
    await tester.pumpAndSettle();
    final context = tester.element(find.text('Theme'));
    expect(Theme.of(context).brightness, Brightness.dark);
  });

  testWidgets('large text doesn\'t break the main screens', (tester) async {
    await _useSize(tester, const Size(390, 844));
    tester.platformDispatcher.textScaleFactorTestValue = 1.3;
    addTearDown(tester.platformDispatcher.clearTextScaleFactorTestValue);
    await _enterApp(tester);
    for (final tab in ['Tasks', 'Projects', 'Clients', 'More']) {
      await tester.tap(find.text(tab).last);
      await tester.pumpAndSettle();
      expect(tester.takeException(), isNull);
    }
  });
}
