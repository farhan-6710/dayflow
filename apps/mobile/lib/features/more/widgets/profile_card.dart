import 'package:flutter/material.dart';

import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/sample_data/more_data.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/theme/app_theme_extension.dart';
import '../../../core/widgets/app_card.dart';
import '../../../core/widgets/app_toast.dart';

class ProfileCard extends StatelessWidget {
  const ProfileCard({super.key});

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return AppCard(
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () => showAppToast(context, 'Preview only'),
          child: Padding(
            padding: const EdgeInsets.all(AppSpace.lg),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 31,
                  backgroundColor: palette.primary,
                  child: Text(
                    MoreData.userInitials,
                    style: AppTextStyles.body.copyWith(
                      fontSize: 20,
                      color: palette.primaryForeground,
                    ),
                  ),
                ),
                const SizedBox(width: AppSpace.lg),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    spacing: 2,
                    children: [
                      Text(
                        MoreData.userName,
                        style: AppTextStyles.body.copyWith(
                          fontSize: 17,
                          color: palette.foreground,
                        ),
                      ),
                      Text(
                        MoreData.userEmail,
                        overflow: TextOverflow.ellipsis,
                        style: AppTextStyles.bodySmall.copyWith(
                          color: palette.mutedForeground,
                        ),
                      ),
                    ],
                  ),
                ),
                Icon(Icons.chevron_right_rounded, color: palette.foreground),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
