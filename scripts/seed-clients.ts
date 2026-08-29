import { createClient } from "@supabase/supabase-js";

type ClientSeed = {
  company_name: string;
  client_name: string;
  mobile_number: string;
  email: string;
  secondary_contact_name?: string;
  secondary_contact_number?: string;
  website_url: string;
};

const LEGACY_SEED_COMPANY_NAMES = [
  "Velocity Athletics",
  "Summit Build Co.",
  "CareBridge Medical Group",
  "Harvest & Hearth Kitchen",
  "Northline Software Labs",
  "BrightPath Learning Academy",
  "Harborview Realty Partners",
  "Lumen & Loom Fashion",
] as const;

const CLIENTS: ClientSeed[] = [
  {
    company_name: "ProKick Sports Academy",
    client_name: "Rahul Sharma",
    mobile_number: "+91 98765 43210",
    email: "rahul@prokicksports.in",
    secondary_contact_name: "Neha Gupta",
    secondary_contact_number: "+91 98765 43211",
    website_url: "prokicksports.in",
  },
  {
    company_name: "Shree Buildcon Infrastructure",
    client_name: "Vikram Desai",
    mobile_number: "+91 98203 44120",
    email: "vikram.desai@shreebuildcon.com",
    secondary_contact_name: "Anita Joshi",
    secondary_contact_number: "+91 98203 44121",
    website_url: "shreebuildcon.com",
  },
  {
    company_name: "Aarogya Plus Clinics",
    client_name: "Dr. Priya Menon",
    mobile_number: "+91 98470 11223",
    email: "priya.menon@aarogyaplus.in",
    secondary_contact_name: "Dr. Arun Nair",
    secondary_contact_number: "+91 98470 11224",
    website_url: "aarogyaplus.in",
  },
  {
    company_name: "Masala Route Kitchen",
    client_name: "Ananya Iyer",
    mobile_number: "+91 94440 55667",
    email: "ananya@masalaroute.in",
    website_url: "masalaroute.in",
  },
  {
    company_name: "Nimbus Tech Solutions",
    client_name: "Karan Singh",
    mobile_number: "+91 98901 22334",
    email: "karan@nimbustech.io",
    secondary_contact_name: "Sneha Malhotra",
    secondary_contact_number: "+91 98901 22335",
    website_url: "nimbustech.io",
  },
  {
    company_name: "VidyaSetu Learning Hub",
    client_name: "Meera Patel",
    mobile_number: "+91 97250 77889",
    email: "meera@vidyasetu.org",
    website_url: "vidyasetu.org",
  },
  {
    company_name: "GreenLeaf Properties",
    client_name: "Rohit Kapoor",
    mobile_number: "+91 98100 33445",
    email: "rohit.kapoor@greenleafproperties.in",
    secondary_contact_name: "Divya Khanna",
    secondary_contact_number: "+91 98100 33446",
    website_url: "greenleafproperties.in",
  },
  {
    company_name: "Rangrez Ethnic Studio",
    client_name: "Kavya Reddy",
    mobile_number: "+91 90307 88990",
    email: "kavya@rangrezstudio.in",
    website_url: "rangrezstudio.in",
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

async function removeLegacySeedClients(
  supabase: ReturnType<typeof createClient>,
  userId: string,
) {
  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("user_id", userId)
    .in("company_name", [...LEGACY_SEED_COMPANY_NAMES]);

  if (error) {
    throw new Error(`Failed to remove legacy seed clients: ${error.message}`);
  }
}

async function seedClients(
  supabase: ReturnType<typeof createClient>,
  userId: string,
) {
  let createdCount = 0;

  for (const client of CLIENTS) {
    const existing = await supabase
      .from("clients")
      .select("id")
      .eq("admin_id", userId)
      .eq("company_name", client.company_name)
      .maybeSingle();

    if (existing.error) {
      throw new Error(
        `Failed to look up client "${client.company_name}": ${existing.error.message}`,
      );
    }

    if (existing.data) {
      continue;
    }

    const created = await supabase.from("clients").insert({
      admin_id: userId,
      company_name: client.company_name,
      client_name: client.client_name,
      mobile_number: client.mobile_number,
      email: client.email,
      secondary_contact_name: client.secondary_contact_name ?? null,
      secondary_contact_number: client.secondary_contact_number ?? null,
      website_url: client.website_url,
      is_active: true,
    });

    if (created.error) {
      throw new Error(
        `Failed to create client "${client.company_name}": ${created.error.message}`,
      );
    }

    createdCount += 1;
  }

  return createdCount;
}

async function main() {
  const supabaseUrl = requireEnv("VITE_SUPABASE_URL");
  const supabaseKey = requireEnv("VITE_SUPABASE_PUBLISHABLE_KEY");
  const supabase = createClient(supabaseUrl, supabaseKey);
  const userId = await signIn(supabase);

  await removeLegacySeedClients(supabase, userId);
  const clientCount = await seedClients(supabase, userId);

  console.log(`Signed in as ${userId}`);
  console.log(`Seed account email: ${requireEnv("SEED_EMAIL")}`);
  console.log(`Clients created: ${clientCount}`);
  console.log(
    "Done. Legacy western seed clients were removed. Sign in with the seed account email to see the Indian demo clients.",
  );
}

try {
  await main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
}
