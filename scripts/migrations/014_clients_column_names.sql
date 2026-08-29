-- Migration 014 — Align clients column names with company vs contact person

-- company / brand (was client_name)
alter table public.clients rename column client_name to company_name;

-- primary contact person (was primary_contact_name)
alter table public.clients rename column primary_contact_name to client_name;

alter table public.clients rename column website_name to website_url;

alter table public.clients rename column secondary_mobile_number to secondary_contact_number;
