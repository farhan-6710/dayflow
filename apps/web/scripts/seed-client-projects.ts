import { createClient } from "@supabase/supabase-js";

type RaisedBy = "workspace" | "client";

type NoteSeed = { title: string; body: string };
type LinkSeed = { label: string; url: string };

type TaskSeed = {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in_progress" | "completed";
  eta_date: string;
  eta_time: string;
  raised_by: RaisedBy;
};

type MeetingSeed = {
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
  from_date: string;
  from_time: string;
  to_date: string;
  to_time: string;
  venue: "client_location" | "in_office" | "online";
  raised_by: RaisedBy;
};

type CallSeed = {
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
  start_date: string;
  start_time: string;
  duration_minutes: number;
  raised_by: RaisedBy;
};

type ClientProjectSeed = {
  name: string;
  legacy_name?: string;
  color_hex: string;
  client_company_name: string;
  notes: NoteSeed[];
  links: LinkSeed[];
  tasks: TaskSeed[];
  meetings: MeetingSeed[];
  calls: CallSeed[];
};

const LEGACY_DEMO_PROJECT_NAMES = [
  "ProKick site update",
  "Nimbus app work",
  "Clinic website",
  "Academy Website Refresh",
  "Product MVP Delivery",
  "Patient Portal Rollout",
] as const;

const CLIENT_PROJECTS: ClientProjectSeed[] = [
  {
    name: "Turbo Shop website",
    color_hex: "#dc2626",
    client_company_name: "Turbo Shop",
    notes: [
      {
        title: "Site scope",
        body: "Turbo rebuild shop + parts catalog. Vehicle selector on homepage, cart flow, and contact form hooked to turboshopcanada1@gmail.com.",
      },
      {
        title: "Launch checklist",
        body: "Test product pages, USD pricing toggle, and mobile cart. Calgary address in footer is done.",
      },
      {
        title: "Pending from client",
        body: "Need updated product photos for actuator gearboxes and mini kits section.",
      },
    ],
    links: [
      { label: "Live site", url: "https://www.turboshop.ca/" },
      { label: "Contact page", url: "https://www.turboshop.ca/" },
    ],
    tasks: [
      {
        title: "Fix mobile cart drawer",
        description: "Cart icon count not updating on iPhone Safari.",
        priority: "high",
        status: "in_progress",
        eta_date: "2026-09-04",
        eta_time: "2:00 PM",
        raised_by: "workspace",
      },
      {
        title: "Add turbo rebuild FAQ",
        description: "Short section on shipping cores to Calgary.",
        priority: "medium",
        status: "pending",
        eta_date: "2026-09-10",
        eta_time: "11:00 AM",
        raised_by: "client",
      },
      {
        title: "Product image swap",
        description: "Replace placeholder photos on bearing housings.",
        priority: "medium",
        status: "pending",
        eta_date: "2026-09-12",
        eta_time: "4:00 PM",
        raised_by: "client",
      },
      {
        title: "Homepage vehicle selector",
        description: "Make/model dropdown wired and live.",
        priority: "high",
        status: "completed",
        eta_date: "2026-08-18",
        eta_time: "6:00 PM",
        raised_by: "workspace",
      },
    ],
    meetings: [
      {
        title: "Walk through new homepage",
        description: "Review hero, popular products grid, and quote form.",
        status: "completed",
        from_date: "2026-08-12",
        from_time: "8:00 PM",
        to_date: "2026-08-12",
        to_time: "9:00 PM",
        venue: "online",
        raised_by: "workspace",
      },
      {
        title: "Cart & checkout review",
        description: "Test add-to-cart and form submissions together.",
        status: "pending",
        from_date: "2026-09-15",
        from_time: "7:00 PM",
        to_date: "2026-09-15",
        to_time: "7:45 PM",
        venue: "online",
        raised_by: "workspace",
      },
    ],
    calls: [
      {
        title: "Quick sync on product list",
        description: "Which SKUs go on the popular products row.",
        status: "completed",
        start_date: "2026-08-22",
        start_time: "8:30 PM",
        duration_minutes: 20,
        raised_by: "workspace",
      },
      {
        title: "Shipping policy wording",
        description: "Confirm text for turbo core returns.",
        status: "pending",
        start_date: "2026-09-08",
        start_time: "7:00 PM",
        duration_minutes: 15,
        raised_by: "client",
      },
    ],
  },
  {
    name: "Taskforce site",
    color_hex: "#7c3aed",
    client_company_name: "Task Force Interiors",
    notes: [
      {
        title: "Pages live",
        body: "Home, about, services, manufacturing plant, projects gallery, contact. Partner form for suppliers/subcontractors is separate.",
      },
      {
        title: "Content notes",
        body: "Hyderabad HQ address in footer. Emails: info@ and business@. Phone lines 040-23240629 and 040-66669067.",
      },
      {
        title: "Still todo",
        body: "Compress hero background images — a bit slow on mobile 4G.",
      },
    ],
    links: [
      { label: "Live site", url: "https://www.taskforceinteriors.com/" },
      { label: "Contact", url: "https://www.taskforceinteriors.com/contact" },
    ],
    tasks: [
      {
        title: "Projects gallery load fix",
        description: "Six project tiles lazy-load on scroll.",
        priority: "high",
        status: "completed",
        eta_date: "2026-08-14",
        eta_time: "5:00 PM",
        raised_by: "workspace",
      },
      {
        title: "Contact form captcha",
        description: "Refresh button and code validation working.",
        priority: "medium",
        status: "completed",
        eta_date: "2026-08-20",
        eta_time: "3:00 PM",
        raised_by: "workspace",
      },
      {
        title: "Services page icons",
        description: "False ceiling, flooring, mill work sections need icon tweak.",
        priority: "low",
        status: "in_progress",
        eta_date: "2026-09-06",
        eta_time: "11:00 AM",
        raised_by: "workspace",
      },
      {
        title: "Add new hospital project",
        description: "Client sent photos for healthcare portfolio row.",
        priority: "medium",
        status: "pending",
        eta_date: "2026-09-14",
        eta_time: "10:00 AM",
        raised_by: "client",
      },
    ],
    meetings: [
      {
        title: "Site handoff walkthrough",
        description: "Show CMS-free static updates process.",
        status: "completed",
        from_date: "2026-08-08",
        from_time: "11:00 AM",
        to_date: "2026-08-08",
        to_time: "12:00 PM",
        venue: "online",
        raised_by: "workspace",
      },
      {
        title: "New project photos review",
        description: "Pick images for healthcare and corporate tiles.",
        status: "pending",
        from_date: "2026-09-16",
        from_time: "4:00 PM",
        to_date: "2026-09-16",
        to_time: "5:00 PM",
        venue: "online",
        raised_by: "client",
      },
    ],
    calls: [
      {
        title: "Partner form fields",
        description: "Confirm dropdown options for supplier vs subcontractor.",
        status: "completed",
        start_date: "2026-08-19",
        start_time: "12:00 PM",
        duration_minutes: 25,
        raised_by: "workspace",
      },
      {
        title: "Mobile menu bug",
        description: "Client reported submenu cut off on small screens.",
        status: "pending",
        start_date: "2026-09-09",
        start_time: "5:30 PM",
        duration_minutes: 20,
        raised_by: "client",
      },
    ],
  },
  {
    name: "Almo site",
    color_hex: "#0891b2",
    client_company_name: "Almo Laminates",
    notes: [
      {
        title: "Site structure",
        body: "Product pages for HPL and compact laminates, design collection, blog, brochures download section.",
      },
      {
        title: "Contact info",
        body: "Phone 040 2323 0065, info@almolaminates.com, Mon–Sat 10:00–21:00.",
      },
      {
        title: "Next update",
        body: "Add 3 new texture swatches to design collection when client sends files.",
      },
    ],
    links: [
      { label: "Live site", url: "https://almolaminates.com/" },
      { label: "Design collection", url: "https://almolaminates.com/" },
    ],
    tasks: [
      {
        title: "Brochure PDF links",
        description: "Wire download buttons in information center.",
        priority: "high",
        status: "completed",
        eta_date: "2026-08-10",
        eta_time: "2:00 PM",
        raised_by: "workspace",
      },
      {
        title: "Blog listing page",
        description: "Pagination and thumbnail grid done.",
        priority: "medium",
        status: "completed",
        eta_date: "2026-08-24",
        eta_time: "4:00 PM",
        raised_by: "workspace",
      },
      {
        title: "New swatch uploads",
        description: "High gloss and suede finish samples pending.",
        priority: "medium",
        status: "pending",
        eta_date: "2026-09-11",
        eta_time: "11:00 AM",
        raised_by: "client",
      },
      {
        title: "Newsletter signup",
        description: "Footer form connected — test delivery.",
        priority: "low",
        status: "in_progress",
        eta_date: "2026-09-05",
        eta_time: "3:00 PM",
        raised_by: "workspace",
      },
    ],
    meetings: [
      {
        title: "Design collection review",
        description: "Walk through gloss vs matte vs suede pages.",
        status: "completed",
        from_date: "2026-08-05",
        from_time: "3:00 PM",
        to_date: "2026-08-05",
        to_time: "4:00 PM",
        venue: "online",
        raised_by: "workspace",
      },
      {
        title: "New product launch page",
        description: "Plan layout for compact laminate series.",
        status: "pending",
        from_date: "2026-09-18",
        from_time: "11:00 AM",
        to_date: "2026-09-18",
        to_time: "12:00 PM",
        venue: "online",
        raised_by: "client",
      },
    ],
    calls: [
      {
        title: "Social links check",
        description: "Facebook, Instagram, LinkedIn URLs in header/footer.",
        status: "completed",
        start_date: "2026-08-16",
        start_time: "11:00 AM",
        duration_minutes: 15,
        raised_by: "workspace",
      },
      {
        title: "Warranty page copy",
        description: "Client sending updated warranty text.",
        status: "pending",
        start_date: "2026-09-07",
        start_time: "12:30 PM",
        duration_minutes: 20,
        raised_by: "client",
      },
    ],
  },
  {
    name: "Tuning Factory website",
    color_hex: "#1d4ed8",
    client_company_name: "Tuning Factory",
    notes: [
      {
        title: "What we built",
        body: "Service booking site for Calgary shop — repairs, maintenance, performance upgrades. Vehicle specialties page (Audi, BMW, Porsche, etc.).",
      },
      {
        title: "Hours in footer",
        body: "Mon–Fri 9 AM–9 PM, Sat–Sun 9 AM–12 PM. Phone 403-993-6742.",
      },
      {
        title: "Small fix queue",
        body: "Captcha on book-now form — client wants simpler flow.",
      },
    ],
    links: [
      { label: "Live site", url: "https://tuningfactory.ca/" },
      { label: "Book service", url: "https://tuningfactory.ca/" },
    ],
    tasks: [
      {
        title: "Service dropdown options",
        description: "Maintenance, repairs, performance — all three wired.",
        priority: "high",
        status: "completed",
        eta_date: "2026-08-11",
        eta_time: "7:00 PM",
        raised_by: "workspace",
      },
      {
        title: "Vehicle pages SEO",
        description: "Meta titles for Golf R, M2, GT3 pages.",
        priority: "medium",
        status: "in_progress",
        eta_date: "2026-09-08",
        eta_time: "6:00 PM",
        raised_by: "workspace",
      },
      {
        title: "Swap hero slider images",
        description: "Client sending new workshop photos.",
        priority: "low",
        status: "pending",
        eta_date: "2026-09-13",
        eta_time: "8:00 PM",
        raised_by: "client",
      },
    ],
    meetings: [
      {
        title: "Launch review",
        description: "Clicked through booking form and vehicle menu.",
        status: "completed",
        from_date: "2026-08-09",
        from_time: "8:00 PM",
        to_date: "2026-08-09",
        to_time: "8:45 PM",
        venue: "online",
        raised_by: "workspace",
      },
    ],
    calls: [
      {
        title: "Booking form test",
        description: "Make sure submissions reach the shop email.",
        status: "completed",
        start_date: "2026-08-23",
        start_time: "9:00 PM",
        duration_minutes: 15,
        raised_by: "workspace",
      },
      {
        title: "Captcha simplify",
        description: "Discuss removing 4-digit code step.",
        status: "pending",
        start_date: "2026-09-10",
        start_time: "8:30 PM",
        duration_minutes: 20,
        raised_by: "client",
      },
    ],
  },
  {
    name: "Yash Computers site",
    color_hex: "#2563eb",
    client_company_name: "Yash Computers",
    notes: [
      {
        title: "Site overview",
        body: "Lead-gen site for refurbished laptops — developer, student, MacBook, gaming categories. WhatsApp + call CTAs on every section.",
      },
      {
        title: "Store numbers",
        body: "Suchitra 8121830905, Kukatpally 9963540040, Ameerpet 8247788615, Vijayawada 9989658327. Email Yashcomputersofficialid@gmail.com.",
      },
      {
        title: "Founder section",
        body: "Yashwanth founder message on homepage — don't remove, he cares about that block.",
      },
    ],
    links: [
      { label: "Live site", url: "https://yashcomputers.in/" },
      { label: "Laptop catalog", url: "https://yashcomputers.in/" },
    ],
    tasks: [
      {
        title: "Inventory cards update",
        description: "Refresh ThinkPad T490 and T14 pricing.",
        priority: "high",
        status: "in_progress",
        eta_date: "2026-09-03",
        eta_time: "11:00 AM",
        raised_by: "client",
      },
      {
        title: "Google reviews widget",
        description: "4.8 rating strip on homepage.",
        priority: "medium",
        status: "completed",
        eta_date: "2026-08-17",
        eta_time: "2:00 PM",
        raised_by: "workspace",
      },
      {
        title: "Free consultation form",
        description: "Hook form to email + WhatsApp notification.",
        priority: "high",
        status: "completed",
        eta_date: "2026-08-06",
        eta_time: "5:00 PM",
        raised_by: "workspace",
      },
      {
        title: "Add new MacBook M1 listing",
        description: "Yashwanth sent specs and price yesterday.",
        priority: "medium",
        status: "pending",
        eta_date: "2026-09-09",
        eta_time: "10:00 AM",
        raised_by: "client",
      },
    ],
    meetings: [
      {
        title: "Homepage conversion review",
        description: "CTA placement and mobile sticky call button.",
        status: "completed",
        from_date: "2026-08-07",
        from_time: "4:00 PM",
        to_date: "2026-08-07",
        to_time: "5:00 PM",
        venue: "online",
        raised_by: "workspace",
      },
      {
        title: "New laptop batch photos",
        description: "Pick images for available-now section.",
        status: "pending",
        from_date: "2026-09-12",
        from_time: "11:00 AM",
        to_date: "2026-09-12",
        to_time: "11:45 AM",
        venue: "online",
        raised_by: "client",
      },
    ],
    calls: [
      {
        title: "Branch phone numbers",
        description: "Confirm which number shows per city section.",
        status: "completed",
        start_date: "2026-08-14",
        start_time: "6:00 PM",
        duration_minutes: 20,
        raised_by: "workspace",
      },
      {
        title: "Student discount banner",
        description: "Text for festival season offer.",
        status: "pending",
        start_date: "2026-09-06",
        start_time: "5:00 PM",
        duration_minutes: 15,
        raised_by: "client",
      },
    ],
  },
  {
    name: "Nick Roofing site",
    color_hex: "#334155",
    client_company_name: "Nick Roofing",
    notes: [
      {
        title: "Site done",
        body: "Local SEO site for Hawthorne NJ — roof repair, gutters, skylights, siding, waterproofing. Gallery and service area pages.",
      },
      {
        title: "Contact block",
        body: "973-207-0689, nickcontractorllc@gmail.com, 525 Lafayette Ave Hawthorne NJ. Mon–Sat 7:30 AM–8 PM.",
      },
      {
        title: "SEO watch",
        body: "Track rankings for 'roofing contractor Hawthorne NJ' after last meta update.",
      },
    ],
    links: [
      { label: "Live site", url: "https://www.nickroofing.com/" },
      { label: "Gallery", url: "https://www.nickroofing.com/" },
    ],
    tasks: [
      {
        title: "Service area pages",
        description: "Wayne, Paramus, Ridgewood local pages indexed.",
        priority: "high",
        status: "completed",
        eta_date: "2026-08-13",
        eta_time: "10:00 AM",
        raised_by: "workspace",
      },
      {
        title: "Gallery compression",
        description: "Before/after roof photos — reduce load time.",
        priority: "medium",
        status: "in_progress",
        eta_date: "2026-09-07",
        eta_time: "9:00 AM",
        raised_by: "workspace",
      },
      {
        title: "Add skylight FAQ entry",
        description: "Nick sent two new questions from customers.",
        priority: "low",
        status: "pending",
        eta_date: "2026-09-15",
        eta_time: "11:00 AM",
        raised_by: "client",
      },
    ],
    meetings: [
      {
        title: "Google review QR section",
        description: "Show scan-to-review block on contact page.",
        status: "completed",
        from_date: "2026-08-16",
        from_time: "9:00 AM",
        to_date: "2026-08-16",
        to_time: "9:30 AM",
        venue: "online",
        raised_by: "workspace",
      },
    ],
    calls: [
      {
        title: "Contact form spam",
        description: "Add honeypot — getting junk submissions.",
        status: "pending",
        start_date: "2026-09-05",
        start_time: "8:00 AM",
        duration_minutes: 15,
        raised_by: "client",
      },
      {
        title: "Blog post upload",
        description: "Nick wants one winter roof prep article live.",
        status: "pending",
        start_date: "2026-09-11",
        start_time: "9:30 AM",
        duration_minutes: 25,
        raised_by: "client",
      },
    ],
  },
  {
    name: "Infinity NYC site",
    color_hex: "#78716c",
    client_company_name: "Infinity Construction NYC",
    notes: [
      {
        title: "Project type",
        body: "Brownstone restoration contractor site — Brooklyn HQ, services, projects, LPC/DOB compliance copy.",
      },
      {
        title: "Contact",
        body: "347-939-5779, Infinityconstructionnyc@gmail.com. Locations in Brooklyn and Manhattan.",
      },
      {
        title: "Portfolio",
        body: "Need before/after shots for brick pointing project — client sending next week.",
      },
    ],
    links: [
      { label: "Live site", url: "https://www.infinityconstructionnyc.com/" },
      { label: "Services", url: "https://www.infinityconstructionnyc.com/" },
    ],
    tasks: [
      {
        title: "Services grid layout",
        description: "Eight services with read-more links — all live.",
        priority: "high",
        status: "completed",
        eta_date: "2026-08-09",
        eta_time: "11:00 AM",
        raised_by: "workspace",
      },
      {
        title: "FAQ schema markup",
        description: "Brownstone repointing and LPC permit questions.",
        priority: "medium",
        status: "completed",
        eta_date: "2026-08-21",
        eta_time: "10:00 AM",
        raised_by: "workspace",
      },
      {
        title: "New project photos",
        description: "Facade restoration gallery update.",
        priority: "medium",
        status: "pending",
        eta_date: "2026-09-13",
        eta_time: "9:00 AM",
        raised_by: "client",
      },
      {
        title: "Affiliate logos row",
        description: "Six affiliate images — swap low-res ones.",
        priority: "low",
        status: "in_progress",
        eta_date: "2026-09-04",
        eta_time: "2:00 PM",
        raised_by: "workspace",
      },
    ],
    meetings: [
      {
        title: "Homepage slider copy",
        description: "Three hero slides — brownstone, roofing, masonry.",
        status: "completed",
        from_date: "2026-08-04",
        from_time: "10:00 AM",
        to_date: "2026-08-04",
        to_time: "11:00 AM",
        venue: "online",
        raised_by: "workspace",
      },
      {
        title: "Projects page expansion",
        description: "Add two Brooklyn brownstone case studies.",
        status: "pending",
        from_date: "2026-09-17",
        from_time: "10:00 AM",
        to_date: "2026-09-17",
        to_time: "11:00 AM",
        venue: "online",
        raised_by: "client",
      },
    ],
    calls: [
      {
        title: "Social links audit",
        description: "Brownstoner, Yelp, LinkedIn, Instagram in footer.",
        status: "completed",
        start_date: "2026-08-26",
        start_time: "11:00 AM",
        duration_minutes: 20,
        raised_by: "workspace",
      },
      {
        title: "Free consultation form",
        description: "Confirm emails land in Gmail inbox not spam.",
        status: "pending",
        start_date: "2026-09-08",
        start_time: "10:30 AM",
        duration_minutes: 15,
        raised_by: "client",
      },
    ],
  },
  {
    name: "Mantoor site upkeep",
    color_hex: "#ca8a04",
    client_company_name: "Mantoor Group",
    notes: [
      {
        title: "Maintenance scope",
        body: "Monthly updates on ongoing projects — Nandan Emerald, Nest, Lake Breeze, Mukunda, Praakrithi County.",
      },
      {
        title: "Contact on site",
        body: "info@mantoorgroup.com, +91 97197 15225. Office at Financial District Nanakramguda.",
      },
      {
        title: "Last month",
        body: "Updated testimonial carousel and WhatsApp button. Next: new banner for Praakrithi County.",
      },
    ],
    links: [
      { label: "Live site", url: "https://mantoorgroup.com/" },
      { label: "Ongoing projects", url: "https://mantoorgroup.com/" },
    ],
    tasks: [
      {
        title: "Update project availability",
        description: "Mark Nandan Nest units sold out on listing.",
        priority: "high",
        status: "in_progress",
        eta_date: "2026-09-02",
        eta_time: "11:00 AM",
        raised_by: "client",
      },
      {
        title: "Fix callback form",
        description: "Enquiry form not sending on mobile Chrome.",
        priority: "high",
        status: "pending",
        eta_date: "2026-09-04",
        eta_time: "3:00 PM",
        raised_by: "client",
      },
      {
        title: "Swap homepage banner",
        description: "New Praakrithi County render from client.",
        priority: "medium",
        status: "pending",
        eta_date: "2026-09-10",
        eta_time: "12:00 PM",
        raised_by: "client",
      },
    ],
    meetings: [
      {
        title: "Monthly maintenance check",
        description: "Quick pass on forms, links, and project pages.",
        status: "completed",
        from_date: "2026-08-28",
        from_time: "11:00 AM",
        to_date: "2026-08-28",
        to_time: "11:30 AM",
        venue: "online",
        raised_by: "workspace",
      },
    ],
    calls: [
      {
        title: "WhatsApp link test",
        description: "Verify click-to-chat opens with pre-filled message.",
        status: "completed",
        start_date: "2026-08-15",
        start_time: "4:00 PM",
        duration_minutes: 10,
        raised_by: "workspace",
      },
      {
        title: "Google Maps embed",
        description: "Office pin on contact section — client says wrong zoom.",
        status: "pending",
        start_date: "2026-09-06",
        start_time: "5:00 PM",
        duration_minutes: 15,
        raised_by: "client",
      },
    ],
  },
  {
    name: "Saptagiri hotel site",
    color_hex: "#be123c",
    client_company_name: "Hotel Saptagiri",
    notes: [
      {
        title: "Maintenance work",
        body: "Boutique hotel site — rooms, Swarn restaurant, banquets, gallery. St Mary's Road Secunderabad.",
      },
      {
        title: "Phones & email",
        body: "99494 66066 WhatsApp, 040 666 777 88 landline. info@ and reservation@hotelsaptagiri.in.",
      },
      {
        title: "Upcoming",
        body: "Diwali banquet package section — waiting on rates from front office.",
      },
    ],
    links: [
      { label: "Live site", url: "https://hotelsaptagiri.in/" },
      { label: "Banquets page", url: "https://hotelsaptagiri.in/" },
    ],
    tasks: [
      {
        title: "Room rates refresh",
        description: "Update Standard/Deluxe/Suite starting prices.",
        priority: "high",
        status: "pending",
        eta_date: "2026-09-05",
        eta_time: "10:00 AM",
        raised_by: "client",
      },
      {
        title: "Gallery new photos",
        description: "Banquet hall setup from last wedding.",
        priority: "medium",
        status: "in_progress",
        eta_date: "2026-09-08",
        eta_time: "11:00 AM",
        raised_by: "client",
      },
      {
        title: "Book now button fix",
        description: "Reservation link opening wrong on iOS.",
        priority: "high",
        status: "pending",
        eta_date: "2026-09-03",
        eta_time: "2:00 PM",
        raised_by: "client",
      },
    ],
    meetings: [
      {
        title: "Monthly site review",
        description: "Check room pages, dining menu PDF, contact map.",
        status: "completed",
        from_date: "2026-08-20",
        from_time: "3:00 PM",
        to_date: "2026-08-20",
        to_time: "3:45 PM",
        venue: "online",
        raised_by: "workspace",
      },
    ],
    calls: [
      {
        title: "Diwali package copy",
        description: "Get banquet pricing for festival section.",
        status: "pending",
        start_date: "2026-09-09",
        start_time: "11:00 AM",
        duration_minutes: 20,
        raised_by: "client",
      },
      {
        title: "Metro distance note",
        description: "Confirm 700m to Parade Ground metro still accurate.",
        status: "completed",
        start_date: "2026-08-12",
        start_time: "12:00 PM",
        duration_minutes: 10,
        raised_by: "workspace",
      },
    ],
  },
  {
    name: "Eat Rrite site upkeep",
    color_hex: "#16a34a",
    client_company_name: "Eat Rrite",
    notes: [
      {
        title: "Site maintenance",
        body: "Nutrition & wellness site — program pages, appointment booking, wellness news. Mukta is the main contact.",
      },
      {
        title: "Contact",
        body: "info@eatrrite.com, +91 96398 77483. Hours Mon–Sun 10 AM–7 PM. Locations Telangana & Dehradun.",
      },
      {
        title: "This month",
        body: "Updated diabetes program page copy. Next: fix slow loading hero on mobile.",
      },
    ],
    links: [
      { label: "Live site", url: "https://eatrrite.com/" },
      { label: "Programs", url: "https://eatrrite.com/" },
    ],
    tasks: [
      {
        title: "Hero slider speed",
        description: "Compress images — client says loading spinner too long.",
        priority: "high",
        status: "in_progress",
        eta_date: "2026-09-04",
        eta_time: "11:00 AM",
        raised_by: "workspace",
      },
      {
        title: "Appointment form test",
        description: "All 10 program options submit correctly.",
        priority: "medium",
        status: "completed",
        eta_date: "2026-08-19",
        eta_time: "4:00 PM",
        raised_by: "workspace",
      },
      {
        title: "Add gut health blog post",
        description: "Mukta sent draft doc — needs formatting.",
        priority: "medium",
        status: "pending",
        eta_date: "2026-09-11",
        eta_time: "10:00 AM",
        raised_by: "client",
      },
    ],
    meetings: [
      {
        title: "Program pages review",
        description: "Weight management and diabetes pages read-through.",
        status: "completed",
        from_date: "2026-08-18",
        from_time: "4:00 PM",
        to_date: "2026-08-18",
        to_time: "4:45 PM",
        venue: "online",
        raised_by: "workspace",
      },
    ],
    calls: [
      {
        title: "WhatsApp button",
        description: "Confirm chat link opens with correct number.",
        status: "completed",
        start_date: "2026-08-08",
        start_time: "5:00 PM",
        duration_minutes: 10,
        raised_by: "workspace",
      },
      {
        title: "Wellness news section",
        description: "Mukta wants one new article every month — set reminder.",
        status: "pending",
        start_date: "2026-09-12",
        start_time: "4:00 PM",
        duration_minutes: 15,
        raised_by: "client",
      },
    ],
  },
  {
    name: "Testing site",
    color_hex: "#a855f7",
    client_company_name: "Testing Company",
    notes: [
      {
        title: "Client portal test",
        body: "Project for f4rh4n67@gmail.com — use this to verify login, linking, and project visibility in the client portal.",
      },
      {
        title: "What to check",
        body: "After running migrations 023 + 024, sign up or log in at /client-portal/auth with f4rh4n67@gmail.com. Projects page should show this project.",
      },
      {
        title: "Project for field",
        body: "Must stay set to Testing Company (not Myself). is_archived = false.",
      },
    ],
    links: [
      { label: "Client portal login", url: "http://localhost:5173/client-portal/auth" },
      { label: "Workspace projects", url: "http://localhost:5173/workspace/projects-management" },
    ],
    tasks: [
      {
        title: "Log in to client portal",
        description: "Use f4rh4n67@gmail.com and confirm you land on the dashboard.",
        priority: "high",
        status: "pending",
        eta_date: "2026-09-01",
        eta_time: "10:00 AM",
        raised_by: "workspace",
      },
      {
        title: "Confirm project shows up",
        description: "Open Projects — this Testing site row should be visible.",
        priority: "high",
        status: "pending",
        eta_date: "2026-09-01",
        eta_time: "10:30 AM",
        raised_by: "workspace",
      },
      {
        title: "Raise a test activity",
        description: "Add a task from the client side with raised_by = client.",
        priority: "low",
        status: "pending",
        eta_date: "2026-09-02",
        eta_time: "11:00 AM",
        raised_by: "client",
      },
    ],
    meetings: [
      {
        title: "Portal walkthrough",
        description: "Click through dashboard, projects, and one project detail page.",
        status: "pending",
        from_date: "2026-09-03",
        from_time: "4:00 PM",
        to_date: "2026-09-03",
        to_time: "4:30 PM",
        venue: "online",
        raised_by: "workspace",
      },
    ],
    calls: [
      {
        title: "Quick sanity check",
        description: "If projects are empty, check fetch_client_portal_projects RPC in network tab.",
        status: "pending",
        start_date: "2026-09-01",
        start_time: "6:00 PM",
        duration_minutes: 15,
        raised_by: "workspace",
      },
    ],
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

  if (error) throw new Error(`Sign-in failed: ${error.message}`);
  const userId = data.user?.id;
  if (!userId) throw new Error("Sign-in succeeded but no user id was returned.");
  return userId;
}

async function removeLegacyDemoProjects(
  supabase: ReturnType<typeof createClient>,
  userId: string,
) {
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("user_id", userId)
    .in("name", [...LEGACY_DEMO_PROJECT_NAMES]);

  if (error) {
    throw new Error(`Failed to remove legacy demo projects: ${error.message}`);
  }
}

async function findClientIdByCompanyName(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  companyName: string,
): Promise<string> {
  const { data, error } = await supabase
    .from("clients")
    .select("id")
    .eq("owner_user_id", userId)
    .eq("company_name", companyName)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to look up client "${companyName}": ${error.message}`);
  }
  if (!data?.id) {
    throw new Error(`Client "${companyName}" not found. Run "bun run seed:clients" first.`);
  }
  return data.id as string;
}

async function findOrCreateClientProject(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  seed: ClientProjectSeed,
  clientId: string,
) {
  const lookupNames = [seed.legacy_name, seed.name].filter(Boolean) as string[];

  for (const lookupName of lookupNames) {
    const existing = await supabase
      .from("projects")
      .select("id, name, project_for")
      .eq("user_id", userId)
      .eq("name", lookupName)
      .maybeSingle();

    if (existing.error) {
      throw new Error(`Failed to look up project "${lookupName}": ${existing.error.message}`);
    }

    if (existing.data) {
      const { error } = await supabase
        .from("projects")
        .update({
          name: seed.name,
          project_for: clientId,
          is_archived: false,
          color_hex: seed.color_hex,
        })
        .eq("id", existing.data.id);

      if (error) {
        throw new Error(`Failed to update project "${lookupName}": ${error.message}`);
      }

      return {
        id: existing.data.id as string,
        created: false,
        renamed: existing.data.name !== seed.name,
      };
    }
  }

  const created = await supabase
    .from("projects")
    .insert({
      user_id: userId,
      name: seed.name,
      color_hex: seed.color_hex,
      project_for: clientId,
      is_archived: false,
    })
    .select("id")
    .single();

  if (created.error) {
    throw new Error(`Failed to create project "${seed.name}": ${created.error.message}`);
  }

  return { id: created.data.id as string, created: true, renamed: false };
}

async function clearProjectActivities(
  supabase: ReturnType<typeof createClient>,
  projectId: string,
) {
  for (const table of [
    "client_activity_tasks",
    "client_activity_meetings",
    "client_activity_calls",
  ] as const) {
    const { error } = await supabase.from(table).delete().eq("project_id", projectId);
    if (error) throw new Error(`Failed to clear ${table}: ${error.message}`);
  }
}

async function seedNotes(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  projectId: string,
  notes: NoteSeed[],
) {
  let createdCount = 0;
  for (const note of notes) {
    const existing = await supabase
      .from("notes")
      .select("id")
      .eq("user_id", userId)
      .eq("project_id", projectId)
      .eq("title", note.title)
      .maybeSingle();

    if (existing.error) {
      throw new Error(`Failed to look up note "${note.title}": ${existing.error.message}`);
    }
    if (existing.data) continue;

    const { error } = await supabase.from("notes").insert({
      user_id: userId,
      project_id: projectId,
      title: note.title,
      body: note.body,
    });
    if (error) throw new Error(`Failed to create note "${note.title}": ${error.message}`);
    createdCount += 1;
  }
  return createdCount;
}

async function seedLinks(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  projectId: string,
  links: LinkSeed[],
) {
  let createdCount = 0;
  for (const link of links) {
    const existing = await supabase
      .from("project_reference_links")
      .select("id")
      .eq("user_id", userId)
      .eq("project_id", projectId)
      .eq("label", link.label)
      .maybeSingle();

    if (existing.error) {
      throw new Error(`Failed to look up link "${link.label}": ${existing.error.message}`);
    }
    if (existing.data) continue;

    const { error } = await supabase.from("project_reference_links").insert({
      user_id: userId,
      project_id: projectId,
      label: link.label,
      url: link.url,
    });
    if (error) throw new Error(`Failed to create link "${link.label}": ${error.message}`);
    createdCount += 1;
  }
  return createdCount;
}

async function seedTasks(
  supabase: ReturnType<typeof createClient>,
  projectId: string,
  tasks: TaskSeed[],
) {
  let createdCount = 0;
  for (const task of tasks) {
    const { error } = await supabase.from("client_activity_tasks").insert({
      project_id: projectId,
      ...task,
    });
    if (error) throw new Error(`Failed to create task "${task.title}": ${error.message}`);
    createdCount += 1;
  }
  return createdCount;
}

async function seedMeetings(
  supabase: ReturnType<typeof createClient>,
  projectId: string,
  meetings: MeetingSeed[],
) {
  let createdCount = 0;
  for (const meeting of meetings) {
    const { error } = await supabase.from("client_activity_meetings").insert({
      project_id: projectId,
      ...meeting,
    });
    if (error) throw new Error(`Failed to create meeting "${meeting.title}": ${error.message}`);
    createdCount += 1;
  }
  return createdCount;
}

async function seedCalls(
  supabase: ReturnType<typeof createClient>,
  projectId: string,
  calls: CallSeed[],
) {
  let createdCount = 0;
  for (const call of calls) {
    const { error } = await supabase.from("client_activity_calls").insert({
      project_id: projectId,
      ...call,
    });
    if (error) throw new Error(`Failed to create call "${call.title}": ${error.message}`);
    createdCount += 1;
  }
  return createdCount;
}

async function main() {
  const supabaseUrl = requireEnv("VITE_SUPABASE_URL");
  const supabaseKey = requireEnv("VITE_SUPABASE_PUBLISHABLE_KEY");
  const supabase = createClient(supabaseUrl, supabaseKey);
  const userId = await signIn(supabase);

  await removeLegacyDemoProjects(supabase, userId);

  let projectCount = 0;
  let renameCount = 0;
  let noteCount = 0;
  let linkCount = 0;
  let taskCount = 0;
  let meetingCount = 0;
  let callCount = 0;

  for (const projectSeed of CLIENT_PROJECTS) {
    const clientId = await findClientIdByCompanyName(
      supabase,
      userId,
      projectSeed.client_company_name,
    );

    const project = await findOrCreateClientProject(supabase, userId, projectSeed, clientId);
    if (project.created) projectCount += 1;
    if (project.renamed) renameCount += 1;

    await clearProjectActivities(supabase, project.id);

    noteCount += await seedNotes(supabase, userId, project.id, projectSeed.notes);
    linkCount += await seedLinks(supabase, userId, project.id, projectSeed.links);
    taskCount += await seedTasks(supabase, project.id, projectSeed.tasks);
    meetingCount += await seedMeetings(supabase, project.id, projectSeed.meetings);
    callCount += await seedCalls(supabase, project.id, projectSeed.calls);

    console.log(`  ${projectSeed.name} → ${projectSeed.client_company_name}`);
  }

  console.log(`Signed in as ${userId}`);
  console.log(`Portfolio projects created: ${projectCount}`);
  console.log(`Projects renamed: ${renameCount}`);
  console.log(`Notes created: ${noteCount}`);
  console.log(`Reference links created: ${linkCount}`);
  console.log(`Tasks: ${taskCount} | Meetings: ${meetingCount} | Calls: ${callCount}`);
  console.log("Done.");
}

try {
  await main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
