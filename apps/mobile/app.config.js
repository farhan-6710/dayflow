const brandManifest = require("../../shared/brand/brandManifest.json");

module.exports = ({ config }) => ({
  ...config,
  name: brandManifest.name,
  description: brandManifest.shortDescription,
  extra: {
    ...config.extra,
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.EXPO_PUBLIC_SUPABASE_KEY,
    brand: {
      name: brandManifest.name,
      tagline: brandManifest.tagline,
      description: brandManifest.description,
      shortDescription: brandManifest.shortDescription,
      positioning: brandManifest.positioning,
    },
  },
  android: {
    ...config.android,
    googleServicesFile:
      process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json",
  },
});
