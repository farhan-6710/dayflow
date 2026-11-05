import 'package:flutter/material.dart';

/// Keeps a page alive while it fades in or out, so it holds its state between tabs.
class FadingPage extends StatelessWidget {
  const FadingPage({super.key, required this.active, required this.child});

  final bool active;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final reduced = MediaQuery.disableAnimationsOf(context);
    return AnimatedOpacity(
      opacity: active ? 1 : 0,
      duration: reduced ? Duration.zero : const Duration(milliseconds: 160),
      child: IgnorePointer(
        ignoring: !active,
        child: ExcludeSemantics(
          excluding: !active,
          child: TickerMode(enabled: active, child: child),
        ),
      ),
    );
  }
}
