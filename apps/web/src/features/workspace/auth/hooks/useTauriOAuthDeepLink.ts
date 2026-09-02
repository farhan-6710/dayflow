import { getCurrent, onOpenUrl } from "@tauri-apps/plugin-deep-link";
import { useEffect } from "react";

import { handleDesktopOAuthCallback } from "@/features/workspace/auth/utils/oauthDesktop";
import { isDesktopApp } from "@/shared/utils/platform";

export function useTauriOAuthDeepLink() {
  useEffect(() => {
    if (!isDesktopApp()) {
      return;
    }

    const handleUrls = (urls: string[]) => {
      for (const url of urls) {
        void handleDesktopOAuthCallback(url);
      }
    };

    void getCurrent()
      .then((urls) => {
        if (urls?.length) {
          handleUrls(urls);
        }
      })
      .catch(() => {
        /* deep links unavailable until the app is installed */
      });

    let unlisten: (() => void) | undefined;

    void onOpenUrl((urls) => {
      handleUrls(urls);
    }).then((off) => {
      unlisten = off;
    });

    return () => {
      unlisten?.();
    };
  }, []);
}
