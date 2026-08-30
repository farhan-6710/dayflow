import { createClient } from "@supabase/supabase-js";

type ClientSeed = {
  company_name: string;
  client_name: string;
  mobile_number: string;
  email: string | null;
  secondary_contact_name?: string;
  secondary_contact_number?: string;
  website_url: string;
};

/** Old placeholder/demo clients removed before seeding the real portfolio. */
const LEGACY_DEMO_COMPANY_NAMES = [
  "Velocity Athletics",
  "Summit Build Co.",
  "CareBridge Medical Group",
  "Harvest & Hearth Kitchen",
  "Northline Software Labs",
  "BrightPath Learning Academy",
  "Harborview Realty Partners",
  "Lumen & Loom Fashion",
  "ProKick Sports Academy",
  "Shree Buildcon Infrastructure",
  "Aarogya Plus Clinics",
  "Masala Route Kitchen",
  "Nimbus Tech Solutions",
  "VidyaSetu Learning Hub",
  "GreenLeaf Properties",
  "Rangrez Ethnic Studio",
  "asadsass",
] as const;

/** Real portfolio clients — contact details sourced from each website. */
const CLIENTS: ClientSeed[] = [
  {
    company_name: "Turbo Shop",
    client_name: "Turbo Shop Team",
    mobile_number: "+1 403-993-6742",
    email: "turboshopcanada1@gmail.com",
    website_url: "turboshop.ca",
  },
  {
    company_name: "Task Force Interiors",
    client_name: "Project Inquiries",
    mobile_number: "+91 40-23240629",
    email: "info@taskforceinteriors.com",
    secondary_contact_name: "Business Desk",
    secondary_contact_number: "+91 40-66669067",
    website_url: "taskforceinteriors.com",
  },
  {
    company_name: "Almo Laminates",
    client_name: "Customer Care",
    mobile_number: "+91 40 2323 0065",
    email: "info@almolaminates.com",
    website_url: "almolaminates.com",
  },
  {
    company_name: "Tuning Factory",
    client_name: "Service Desk",
    mobile_number: "+1 403-993-6742",
    email: null,
    website_url: "tuningfactory.ca",
  },
  {
    company_name: "Yash Computers",
    client_name: "Yashwanth",
    mobile_number: "+91 81218 30905",
    email: "Yashcomputersofficialid@gmail.com",
    secondary_contact_name: "Kukatpally Branch",
    secondary_contact_number: "+91 9963540040",
    website_url: "yashcomputers.in",
  },
  {
    company_name: "Nick Roofing",
    client_name: "Nick",
    mobile_number: "+1 973-207-0689",
    email: "nickcontractorllc@gmail.com",
    website_url: "nickroofing.com",
  },
  {
    company_name: "Infinity Construction NYC",
    client_name: "Brooklyn Office",
    mobile_number: "+1 347-939-5779",
    email: "Infinityconstructionnyc@gmail.com",
    website_url: "infinityconstructionnyc.com",
  },
  {
    company_name: "Mantoor Group",
    client_name: "Sales Team",
    mobile_number: "+91 97197 15225",
    email: "info@mantoorgroup.com",
    website_url: "mantoorgroup.com",
  },
  {
    company_name: "Hotel Saptagiri",
    client_name: "Reservations Desk",
    mobile_number: "+91 99494 66066",
    email: "info@hotelsaptagiri.in",
    secondary_contact_name: "Reservations",
    secondary_contact_number: "+91 40 666 777 88",
    website_url: "hotelsaptagiri.in",
  },
  {
    company_name: "Eat Rrite",
    client_name: "Mukta",
    mobile_number: "+91 96398 77483",
    email: "info@eatrrite.com",
    website_url: "eatrrite.com",
  },
  {
    company_name: "Testing Company",
    client_name: "Farhan Ahmed",
    mobile_number: "+91 9087654321",
    email: "f4rh4n67@gmail.com",
    website_url: "",
  },
];

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing ${name}. Add it to .env before running the seed script.`);
  }
  return value;
}

async function signIn(supabase: ReturnType<typeof createClient>) {
  const email = requireEnv("SEED_EMAIL");
  const password = requireEnv("SEED_PASSWORD");
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    throw new Error(`Sign-in failed: ${error.message}`);
  }

  const userId = data.user?.id;
  if (!userId) {
    throw new Error("Sign-in succeeded but no user id was returned.");
  }

  return userId;
}

async function removeLegacyDemoClients(
  supabase: ReturnType<typeof createClient>,
  userId: string,
) {
  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("admin_id", userId)
    .in("company_name", [...LEGACY_DEMO_COMPANY_NAMES]);

  if (error) {
    throw new Error(`Failed to remove legacy demo clients: ${error.message}`);
  }
}

async function upsertClient(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  client: ClientSeed,
) {
  const existingByCompany = await supabase
    .from("clients")
    .select("id")
    .eq("admin_id", userId)
    .eq("company_name", client.company_name)
    .maybeSingle();

  if (existingByCompany.error) {
    throw new Error(
      `Failed to look up client "${client.company_name}": ${existingByCompany.error.message}`,
    );
  }

  let clientId = existingByCompany.data?.id as string | undefined;

  if (!clientId && client.email) {
    const existingByEmail = await supabase
      .from("clients")
      .select("id")
      .eq("admin_id", userId)
      .ilike("email", client.email)
      .maybeSingle();

    if (existingByEmail.error) {
      throw new Error(
        `Failed to look up client by email "${client.email}": ${existingByEmail.error.message}`,
      );
    }

    clientId = existingByEmail.data?.id as string | undefined;
  }

  const row = {
    admin_id: userId,
    company_name: client.company_name,
    client_name: client.client_name,
    mobile_number: client.mobile_number,
    email: client.email,
    secondary_contact_name: client.secondary_contact_name ?? null,
    secondary_contact_number: client.secondary_contact_number ?? null,
    website_url: client.website_url || null,
    is_active: true,
  };

  if (clientId) {
    const { error } = await supabase.from("clients").update(row).eq("id", clientId);
    if (error) {
      throw new Error(`Failed to update client "${client.company_name}": ${error.message}`);
    }
    return { created: false, updated: true };
  }

  const created = await supabase.from("clients").insert(row);
  if (created.error) {
    throw new Error(`Failed to create client "${client.company_name}": ${created.error.message}`);
  }

  return { created: true, updated: false };
}

async function main() {
  const supabaseUrl = requireEnv("VITE_SUPABASE_URL");
  const supabaseKey = requireEnv("VITE_SUPABASE_PUBLISHABLE_KEY");
  const supabase = createClient(supabaseUrl, supabaseKey);
  const userId = await signIn(supabase);

  await removeLegacyDemoClients(supabase, userId);

  let createdCount = 0;
  let updatedCount = 0;

  for (const client of CLIENTS) {
    const result = await upsertClient(supabase, userId, client);
    if (result.created) createdCount += 1;
    if (result.updated) updatedCount += 1;
  }

  console.log(`Signed in as ${userId}`);
  console.log(`Seed account email: ${requireEnv("SEED_EMAIL")}`);
  console.log(`Portfolio clients created: ${createdCount}`);
  console.log(`Portfolio clients updated: ${updatedCount}`);
  console.log("Done. Legacy demo clients were removed.");
}

try {
  await main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
}
