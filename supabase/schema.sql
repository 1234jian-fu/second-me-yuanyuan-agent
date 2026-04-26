begin;

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  persona_summary text,
  memory_summary text,
  settings jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.text_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text,
  content text not null,
  mood text,
  tags text[] not null default '{}'::text[],
  summary text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audio_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text,
  storage_path text not null,
  public_url text,
  duration_seconds integer,
  mime_type text,
  file_size integer,
  transcript text,
  transcript_status text check (
    transcript_status in ('pending', 'processing', 'completed', 'failed')
  ),
  summary text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text,
  summary text,
  memory_snapshot jsonb,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.chat_sessions(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role text not null check (role in ('system', 'user', 'assistant')),
  content text not null,
  provider text,
  model text,
  tokens integer,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  description text,
  plan_date date not null default current_date,
  status text not null default 'todo' check (status in ('todo', 'done', 'archived')),
  source text not null default 'manual' check (source in ('manual', 'ai')),
  priority integer,
  sort_order integer,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists text_entries_user_created_idx
  on public.text_entries(user_id, created_at desc);

create index if not exists audio_entries_user_created_idx
  on public.audio_entries(user_id, created_at desc);

create index if not exists chat_sessions_user_updated_idx
  on public.chat_sessions(user_id, updated_at desc);

create index if not exists chat_messages_session_created_idx
  on public.chat_messages(session_id, created_at asc);

create index if not exists plans_user_date_status_idx
  on public.plans(user_id, plan_date, status);

drop trigger if exists set_users_updated_at on public.users;
create trigger set_users_updated_at
before update on public.users
for each row execute function public.set_updated_at();

drop trigger if exists set_text_entries_updated_at on public.text_entries;
create trigger set_text_entries_updated_at
before update on public.text_entries
for each row execute function public.set_updated_at();

drop trigger if exists set_audio_entries_updated_at on public.audio_entries;
create trigger set_audio_entries_updated_at
before update on public.audio_entries
for each row execute function public.set_updated_at();

drop trigger if exists set_chat_sessions_updated_at on public.chat_sessions;
create trigger set_chat_sessions_updated_at
before update on public.chat_sessions
for each row execute function public.set_updated_at();

drop trigger if exists set_plans_updated_at on public.plans;
create trigger set_plans_updated_at
before update on public.plans
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(coalesce(new.email, ''), '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.users enable row level security;
alter table public.text_entries enable row level security;
alter table public.audio_entries enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;
alter table public.plans enable row level security;

drop policy if exists "Users can read own profile" on public.users;
create policy "Users can read own profile"
on public.users for select
to authenticated
using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.users;
create policy "Users can insert own profile"
on public.users for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.users;
create policy "Users can update own profile"
on public.users for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Users can manage own text entries" on public.text_entries;
create policy "Users can manage own text entries"
on public.text_entries for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can manage own audio entries" on public.audio_entries;
create policy "Users can manage own audio entries"
on public.audio_entries for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can manage own chat sessions" on public.chat_sessions;
create policy "Users can manage own chat sessions"
on public.chat_sessions for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can select own chat messages" on public.chat_messages;
create policy "Users can select own chat messages"
on public.chat_messages for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own chat messages" on public.chat_messages;
create policy "Users can insert own chat messages"
on public.chat_messages for insert
to authenticated
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.chat_sessions
    where chat_sessions.id = chat_messages.session_id
      and chat_sessions.user_id = auth.uid()
  )
);

drop policy if exists "Users can manage own plans" on public.plans;
create policy "Users can manage own plans"
on public.plans for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

comment on table public.text_entries is 'MVP text records. Future memory summaries and embeddings can link back to these rows.';
comment on table public.audio_entries is 'MVP audio metadata. Raw files live in Supabase Storage; transcript fields are reserved for later speech-to-text.';
comment on column public.users.persona_summary is 'Reserved for future stable persona/profile summary.';
comment on column public.users.memory_summary is 'Reserved for future compressed long-term memory.';
comment on column public.chat_sessions.memory_snapshot is 'Reserved for future per-session memory context.';
comment on column public.text_entries.metadata is 'Reserved for future image, import, embedding, source, and processing metadata.';
comment on column public.audio_entries.metadata is 'Reserved for future device, transcription, embedding, and processing metadata.';

commit;
