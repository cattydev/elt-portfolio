-- ELT Portfolio Platform — Supabase Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  username text unique,
  avatar_url text,
  cover_url text,
  bio text,
  theme text default 'minimal' check (theme in ('minimal', 'academic', 'creative')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Portfolio sections
create table public.portfolio_sections (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  type text not null check (type in (
    'about', 'education', 'experience', 'lesson_plans', 'materials',
    'videos', 'language_proficiency', 'certificates', 'reflections',
    'academic_works', 'skills'
  )),
  title text not null,
  position integer not null default 0,
  visible boolean default true,
  data jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS Policies
alter table public.profiles enable row level security;
alter table public.portfolio_sections enable row level security;

-- Profiles: anyone can read (for public portfolios)
create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- Sections: public can read visible sections
create policy "Public sections are viewable"
  on public.portfolio_sections for select
  using (visible = true or auth.uid() = profile_id);

create policy "Users can insert their own sections"
  on public.portfolio_sections for insert
  with check (auth.uid() = profile_id);

create policy "Users can update their own sections"
  on public.portfolio_sections for update
  using (auth.uid() = profile_id);

create policy "Users can delete their own sections"
  on public.portfolio_sections for delete
  using (auth.uid() = profile_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, username)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    lower(regexp_replace(split_part(new.email, '@', 1), '[^a-z0-9]', '', 'g'))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Storage bucket for uploads
insert into storage.buckets (id, name, public) values ('portfolios', 'portfolios', true);

create policy "Public read access"
  on storage.objects for select
  using (bucket_id = 'portfolios');

create policy "Authenticated users can upload"
  on storage.objects for insert
  with check (bucket_id = 'portfolios' and auth.role() = 'authenticated');

create policy "Users can delete their own files"
  on storage.objects for delete
  using (bucket_id = 'portfolios' and auth.uid()::text = (storage.foldername(name))[1]);
