-- =========================================================
-- ATELIER FINANCE RLS POLICIES
-- Chạy file này sau khi đã tạo schema.
-- =========================================================

-- Bật RLS cho bảng dữ liệu cá nhân
alter table public.profiles enable row level security;
alter table public.watchlists enable row level security;
alter table public.checklist_results enable row level security;
alter table public.investment_journals enable row level security;
alter table public.simulation_trades enable row level security;

-- Profiles
create policy "Users can view their own profile"
on public.profiles
for select
using (auth.uid() = id);

create policy "Users can update their own profile"
on public.profiles
for update
using (auth.uid() = id);

-- Watchlists
create policy "Users can view their own watchlist"
on public.watchlists
for select
using (auth.uid() = user_id);

create policy "Users can insert their own watchlist"
on public.watchlists
for insert
with check (auth.uid() = user_id);

create policy "Users can delete their own watchlist"
on public.watchlists
for delete
using (auth.uid() = user_id);

-- Checklist results
create policy "Users can view their own checklist results"
on public.checklist_results
for select
using (auth.uid() = user_id);

create policy "Users can insert their own checklist results"
on public.checklist_results
for insert
with check (auth.uid() = user_id);

-- Investment journals
create policy "Users can view their own journals"
on public.investment_journals
for select
using (auth.uid() = user_id);

create policy "Users can insert their own journals"
on public.investment_journals
for insert
with check (auth.uid() = user_id);

create policy "Users can update their own journals"
on public.investment_journals
for update
using (auth.uid() = user_id);

create policy "Users can delete their own journals"
on public.investment_journals
for delete
using (auth.uid() = user_id);

-- Simulation trades
create policy "Users can view their own simulation trades"
on public.simulation_trades
for select
using (auth.uid() = user_id);

create policy "Users can insert their own simulation trades"
on public.simulation_trades
for insert
with check (auth.uid() = user_id);