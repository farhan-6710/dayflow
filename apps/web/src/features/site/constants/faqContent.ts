import type { FaqItem } from "@/features/site/types/components";

export const FAQ = {
  pill: "FAQs",
  title: "Frequently asked questions",
  accent: "questions",
  aside: "Good to know",
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: "What is DayFlow?",
    a: "A workspace for freelancers to manage clients, projects, tasks, meetings, notes and reminders in one place, with a portal that keeps each client up to date.",
  },
  {
    q: "Who is DayFlow for?",
    a: "Freelancers and independent professionals who run work for clients: designers, developers, writers, consultants and anyone juggling several clients at once.",
  },
  {
    q: "How does the client portal work?",
    a: "Add your client's email to their record. When they sign in to the client portal with that email, they see only the projects you share and can raise tasks, meetings and calls for you to review.",
  },
  {
    q: "Can I track personal projects too?",
    a: "Yes. A project without a client is personal, so your own work sits beside client work with the same tasks, notes and links.",
  },
  {
    q: "Does it work on my phone?",
    a: "The web app works at phone, tablet and desktop widths. A desktop app is also available, and a mobile app is in progress.",
  },
  {
    q: "How do I sign in?",
    a: "With your email and a password, or with Google. Clients sign in to their own portal the same way.",
  },
  {
    q: "Is my data private?",
    a: "Row-level security protects every record: you only ever see your own workspace, and clients only see the projects you share with them.",
  },
];
