-- =====================================================================
-- SIMA SHOP - PUBG PC (Steam) Marketplace
-- Database & Cloud Storage Schema for Supabase (PostgreSQL)
-- =====================================================================

-- 1. ACCOUNTS TABLE (PUBG Steam Accounts Inventory)
CREATE TABLE IF NOT EXISTS public.accounts (
    id TEXT PRIMARY KEY,
    region TEXT NOT NULL DEFAULT 'th', -- 'th' | 'cn' | 'vn'
    category TEXT NOT NULL DEFAULT 'progressive', -- 'progressive' | 'rank-ready' | 'rare-skins' | 'budget'
    title_th TEXT NOT NULL,
    title_en TEXT NOT NULL,
    subtitle_th TEXT DEFAULT '',
    subtitle_en TEXT DEFAULT '',
    price_thb NUMERIC NOT NULL DEFAULT 0,
    price_vnd NUMERIC NOT NULL DEFAULT 0,
    original_price_thb NUMERIC DEFAULT 0,
    original_price_vnd NUMERIC DEFAULT 0,
    tags JSONB DEFAULT '["Progressive", "OriginalMail"]'::jsonb,
    images JSONB DEFAULT '[]'::jsonb,
    binding_th TEXT DEFAULT 'id steam มีประกันมือ 1',
    binding_en TEXT DEFAULT 'Steam ID with 1st-hand warranty',
    rank TEXT DEFAULT 'Master 500 LP',
    playtime_th TEXT DEFAULT '1,500 ชม.',
    playtime_en TEXT DEFAULT '1,500 hrs',
    gun_level_th TEXT DEFAULT '',
    gun_level_en TEXT DEFAULT '',
    warranty_th TEXT DEFAULT 'มีประกันมือ 1 แท้ (ปลอดภัย 100%)',
    warranty_en TEXT DEFAULT '1st Hand Owner Warranty (100% Secure)',
    details_th TEXT DEFAULT '',
    details_en TEXT DEFAULT '',
    video_url TEXT DEFAULT '',
    steam_user TEXT DEFAULT '',
    steam_pass TEXT DEFAULT '',
    steam_email TEXT DEFAULT '',
    is_sold BOOLEAN DEFAULT FALSE,
    is_hot BOOLEAN DEFAULT FALSE,
    accent_color TEXT DEFAULT 'from-slate-900 to-amber-950/40',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ORDERS TABLE (Customer Orders & Steam Vault Delivery)
CREATE TABLE IF NOT EXISTS public.orders (
    order_id TEXT PRIMARY KEY,
    user_id TEXT,
    customer_name TEXT NOT NULL,
    account_id TEXT REFERENCES public.accounts(id) ON DELETE SET NULL,
    account_title TEXT NOT NULL,
    amount_thb NUMERIC NOT NULL DEFAULT 0,
    amount_vnd NUMERIC NOT NULL DEFAULT 0,
    payment_method TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'completed', -- 'completed' | 'pending' | 'refunded'
    steam_user TEXT NOT NULL,
    steam_pass TEXT NOT NULL,
    mail_info TEXT NOT NULL,
    warranty TEXT DEFAULT 'มีประกันมือ 1 แท้ (ปลอดภัย 100%)',
    region TEXT DEFAULT 'th',
    slip_image TEXT, -- CDN URL or Base64 of customer uploaded bank transfer slip
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. USERS TABLE (SIMA Members)
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    avatar TEXT DEFAULT '🎮',
    country TEXT DEFAULT 'th',
    balance_thb NUMERIC DEFAULT 0,
    balance_vnd NUMERIC DEFAULT 0,
    joined_date TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. STORE SETTINGS TABLE (Payment QR, Gateways, Announcements)
CREATE TABLE IF NOT EXISTS public.store_settings (
    id TEXT PRIMARY KEY DEFAULT 'global',
    promptpay_id TEXT DEFAULT '0891234567',
    promptpay_name TEXT DEFAULT 'นาย สิมะ ช็อป (SIMA SHOP)',
    vietqr_bank TEXT DEFAULT 'MB',
    vietqr_account_no TEXT DEFAULT '0987654321',
    vietqr_account_name TEXT DEFAULT 'SIMA SHOP VN',
    announcement_text TEXT DEFAULT '🔥 SIMA Shop ตลาดซื้อ-ขายไอดี PUBG PC (Steam) อันดับ 1 | ปลอดภัย 100% ส่งมอบเมลแรก & โอนย้าย Steam ทันที',
    auto_delivery BOOLEAN DEFAULT TRUE,
    auto_slip_verify BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CLOUD STORAGE BUCKET (PUBG Screenshots & Bank Transfer Slips)
-- Create public bucket 'sima-assets' if not already created
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'sima-assets',
    'sima-assets',
    true,
    5242880, -- 5 MB max per image
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Reset table policies for clean idempotent execution
DROP POLICY IF EXISTS "Public Read Accounts" ON public.accounts;
DROP POLICY IF EXISTS "Public Manage Accounts" ON public.accounts;
DROP POLICY IF EXISTS "Public Read Orders" ON public.orders;
DROP POLICY IF EXISTS "Public Manage Orders" ON public.orders;
DROP POLICY IF EXISTS "Public Read Users" ON public.users;
DROP POLICY IF EXISTS "Public Manage Users" ON public.users;
DROP POLICY IF EXISTS "Public Read Store Settings" ON public.store_settings;
DROP POLICY IF EXISTS "Public Manage Store Settings" ON public.store_settings;

-- Public Permissive Policies (Seamless Client Anon Key integration)
CREATE POLICY "Public Read Accounts" ON public.accounts FOR SELECT USING (true);
CREATE POLICY "Public Manage Accounts" ON public.accounts FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public Read Orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public Manage Orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public Read Users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Public Manage Users" ON public.users FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public Read Store Settings" ON public.store_settings FOR SELECT USING (true);
CREATE POLICY "Public Manage Store Settings" ON public.store_settings FOR ALL USING (true) WITH CHECK (true);

-- Storage Object Policies for 'sima-assets' bucket
DROP POLICY IF EXISTS "Public Read sima-assets" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload sima-assets" ON storage.objects;
DROP POLICY IF EXISTS "Public Update sima-assets" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete sima-assets" ON storage.objects;

CREATE POLICY "Public Read sima-assets" ON storage.objects FOR SELECT USING (bucket_id = 'sima-assets');
CREATE POLICY "Public Upload sima-assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'sima-assets');
CREATE POLICY "Public Update sima-assets" ON storage.objects FOR UPDATE USING (bucket_id = 'sima-assets');
CREATE POLICY "Public Delete sima-assets" ON storage.objects FOR DELETE USING (bucket_id = 'sima-assets');

-- =====================================================================
-- INITIAL PRODUCTION DATA
-- =====================================================================

-- Default Store Settings
INSERT INTO public.store_settings (id, promptpay_id, promptpay_name, vietqr_bank, vietqr_account_no, vietqr_account_name)
VALUES ('global', '0891234567', 'นาย สิมะ ช็อป (SIMA SHOP)', 'MB', '0987654321', 'SIMA SHOP VN')
ON CONFLICT (id) DO NOTHING;

-- Seed: Real Production Account (PC-1001: Aug Minotaur Lv.10 Max + 3 Supercars)
INSERT INTO public.accounts (
    id, region, category,
    title_th, title_en,
    subtitle_th, subtitle_en,
    price_thb, price_vnd,
    original_price_thb, original_price_vnd,
    tags, rank, playtime_th, playtime_en,
    gun_level_th, gun_level_en,
    details_th, details_en,
    steam_user, steam_pass, steam_email,
    is_sold, is_hot, accent_color
)
VALUES 
(
    'PC-1001', 'cn', 'progressive',
    'Aug มิโนทอร์ ขาว คู่เขียว คู่ทอง + รถ 3 คัน',
    'Aug Minotaur Lv.10 Max + Chroma & 3 Supercars',
    'แฟชั่นแต่งทรงจีนสวยๆ Urus S, Cayenne, Aston Martin',
    'Exclusive Fashion, Urus S, Cayenne & Aston Martin',
    16000, 11500000,
    19200, 13800000,
    '["Progressive", "OriginalMail", "HotDeal"]'::jsonb,
    'Master (Diamond+)', '1,500 ชม.', '1,500 hrs',
    'Aug Lv.10 Max + Chroma | Mini Lv.6 Max | Beryl Lv.2 | MK12 Lv.1 | Dragunov Lv.1',
    'Aug Lv.10 Max + Chroma | Mini Lv.6 Max | Beryl Lv.2 | MK12 Lv.1 | Dragunov Lv.1',
    'ขาย 16000 บาท Aug มิโนทอร์ ขาว คู่เขียว คู่ทอง ชุดสวยเเต่งทรงจีน,newjen,รถ 3 คัน,ไอดีที่คนตามหา\nid steam ไทย มีประกันมือ 1',
    'Aug Minotaur Lv.10 Max + Chroma, Mini Lv.6 Max, Beryl Lv.2, 3 Supercars, 1st Hand Warranty.',
    'sima_steam_user', 'Pass#2026Secure', 'ogmail_pubg@gmail.com | pass: Steam2026',
    false, true, 'from-slate-900 via-amber-950/40 to-slate-950'
)
ON CONFLICT (id) DO NOTHING;
