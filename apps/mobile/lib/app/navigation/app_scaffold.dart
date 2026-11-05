import 'package:flutter/material.dart';

import '../../core/constants/app_dimensions.dart';
import '../../core/theme/app_text_styles.dart';
import '../../core/theme/app_theme_extension.dart';
import '../../core/widgets/app_icon_button.dart';

/// One page: the top bar with menu icon, then one scrolling column of content.
class AppScaffold extends StatelessWidget {
  const AppScaffold({
    super.key,
    this.title,
    this.center,
    this.actions = const [],
    required this.children,
  });

  final String? title;

  /// Shown in the middle of the top bar instead of a title (the Home logo).
  final Widget? center;
  final List<Widget> actions;
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      bottom: false,
      child: Column(
        children: [
          SizedBox(
            height: 56,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppSpace.sm),
              child: Row(
                children: [
                  AppIconButton(
                    icon: Icons.notes_rounded,
                    size: 28,
                    label: 'Open menu',
                    onPressed: () => Scaffold.of(context).openDrawer(),
                  ),
                  const SizedBox(width: AppSpace.xs),
                  Expanded(
                    child: center != null
                        ? Center(child: center)
                        : Text(
                            title ?? '',
                            overflow: TextOverflow.ellipsis,
                            style: AppTextStyles.pageTitle.copyWith(
                              color: context.palette.foreground,
                            ),
                          ),
                  ),
                  ...actions,
                ],
              ),
            ),
          ),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.fromLTRB(
                AppSpace.page,
                AppSpace.sm,
                AppSpace.page,
                AppSpace.xxl,
              ),
              children: children,
            ),
          ),
        ],
      ),
    );
  }
}
