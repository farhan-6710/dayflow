import {
  SITE_ABOUT_PATH,
  SITE_CONTACT_PATH,
  SITE_FEATURES_PATH,
  SITE_HOME_PATH,
  SITE_HOW_IT_WORKS_PATH,
} from "@/app/constants/siteRoutes";

export const SITE_NAV_LINKS = [
  { label: "Home", to: SITE_HOME_PATH },
  { label: "About", to: SITE_ABOUT_PATH },
  { label: "Features", to: SITE_FEATURES_PATH },
  { label: "How it works", to: SITE_HOW_IT_WORKS_PATH },
  { label: "Contact", to: SITE_CONTACT_PATH },
];

export const DESKTOP_RELEASES_URL = "https://github.com/farhan-6710/dayflow/releases";
