-- =====================================================================
-- SIMA SHOP - PUBG PC (Steam) Marketplace
-- Database Schema for Supabase (PostgreSQL)
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
    slip_image TEXT, -- Base64 or URL of customer uploaded bank transfer slip
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

-- Enable Row Level Security (RLS)
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Allow Public Read Access for Available Accounts & Store Settings
CREATE POLICY "Public Read Accounts" ON public.accounts FOR SELECT USING (true);
CREATE POLICY "Public Read Store Settings" ON public.store_settings FOR SELECT USING (true);

-- Allow Public Insert for Orders & Users (Customer registration & checkout)
CREATE POLICY "Public Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Select Orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public Insert Users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Select Users" ON public.users FOR SELECT USING (true);

-- Allow All Operations with Service Role (Admin)
CREATE POLICY "Admin Full Access Accounts" ON public.accounts FOR ALL USING (true);
CREATE POLICY "Admin Full Access Orders" ON public.orders FOR ALL USING (true);
CREATE POLICY "Admin Full Access Users" ON public.users FOR ALL USING (true);
CREATE POLICY "Admin Full Access Settings" ON public.store_settings FOR ALL USING (true);

-- =====================================================================
-- INITIAL SEED DATA
-- =====================================================================

-- Default Store Settings
INSERT INTO public.store_settings (id, promptpay_id, promptpay_name, vietqr_bank, vietqr_account_no, vietqr_account_name)
VALUES ('global', '0891234567', 'นาย สิมะ ช็อป (SIMA SHOP)', 'MB', '0987654321', 'SIMA SHOP VN')
ON CONFLICT (id) DO NOTHING;

-- Initial Demo Accounts
INSERT INTO public.accounts (id, region, category, title_th, title_en, subtitle_th, subtitle_en, price_thb, price_vnd, original_price_thb, original_price_vnd, tags, rank, playtime_th, playtime_en, gun_level_th, gun_level_en, details_th, details_en, steam_user, steam_pass, steam_email, is_sold, is_hot, accent_color)
VALUES 
(
    'PC-1001', 'cn', 'progressive',
    'Aug มิโนทอร์ ขาว คู่เขียว คู่ทอง + รถ 3 คัน',
    'Aug Minotaur Lv.10 Max + Chroma & 3 Supercars',
    'แฟชั่นแต่งทรงจีนสวยๆ Urus S, Cayenne, Aston Martin',
    'Exclusive Fashion, Urus S, Cayenne & Aston Martin',
    16000, 11500000, 19200, 13800000,
    '["Progressive", "OriginalMail", "HotDeal"]'::jsonb,
    'Master (Diamond+)', '1,500 ชม.', '1,500 hrs',
    'Aug Lv.10 Max + Chroma | Mini Lv.6 Max | Beryl Lv.2',
    'Aug Lv.10 Max + Chroma | Mini Lv.6 Max | Beryl Lv.2',
    'ขาย 16000 บาท Aug มิโนทอร์ ขาว คู่เขียว คู่ทอง ชุดสวยเเต่งทรงจีน,newjen,รถ 3 คัน,ไอดีที่คนตามหา\nid steam ไทย มีประกันมือ 1',
    'Aug Minotaur Lv.10 Max + Chroma, Mini Lv.6, Beryl Lv.2, 3 Supercars, 1st Hand Warranty.',
    'sima_minotaur_th', 'MinoSteam#2026', 'og_minotaur@gmail.com | pass: SteamMino99',
    false, true, 'from-amber-950/60 via-slate-900 to-slate-950'
),
(
    'PC-1002', 'th', 'rare-skins',
    'PUBG Steam ยุคแรก + แจ็กเก็ต BAPE แท้ + เสื้อพราง',
    'Original PUBG Steam + Authentic BAPE Jacket',
    'ของสะสมระดับตำนาน ไม่มีขายในเกมอีกต่อไป',
    'Rare Collector Edition, Discontinued Outfits',
    2990, 2200000, 3800, 2800000,
    '["BAPE", "OriginalMail", "Rare"]'::jsonb,
    'Platinum II', '2,400 ชม.', '2,400 hrs',
    'M416 Silver Plate, Kar98k Shark',
    'M416 Silver Plate, Kar98k Shark',
    'ไอดีไทยแท้ ยุคเปิดเซิร์ฟเวอร์ ชุด BAPE แท้ กล่องครบคอลเลกชัน',
    'Authentic Early Access Steam account with exclusive BAPE outfits.',
    'bape_collector_99', 'BapeSteam#998', 'bape_og_mail@yahoo.com | pass: BapeKing2026',
    false, false, 'from-amber-900/40 to-slate-900'
),
(
    'PC-1003', 'th', 'rank-ready',
    'Rank Ready Plus + Survival Lv.120+ โอนย้ายทันที',
    'Rank Ready Plus + Survival Lv.120+ Instant Transfer',
    'ผูกเบอร์ใหม่ได้ทันที สถิติ KD 3.20 พร้อมลงแรงค์',
    'Verified SMS Ready, Clean Stats KD 3.20',
    530, 390000, 690, 500000,
    '["RankReady", "Budget"]'::jsonb,
    'Unranked (Plus Active)', '320 ชม.', '320 hrs',
    'Default Weapon Arsenal',
    'Default Weapon Arsenal',
    'ไอดีสเมิร์ฟพร้อมลงแรงค์ Steam แท้ ไม่เคยใช้โปรแกรมช่วยเล่น',
    'Competitive rank-ready smurf account with PUBG Plus activated.',
    'rank_smurf_th', 'P@ssw0rdReady', 'smurf_rank_plus@outlook.com | pass: Th123456!',
    false, false, 'from-emerald-950/40 to-slate-900'
),
(
    'PC-1004', 'vn', 'progressive',
    'M416 เทพเสือดาวคำราม Lv.8 พร้อมแอนิเมชันสังหาร',
    'M416 Roaring Tiger Lv.8 with Kill Feed FX',
    'สกินยอดนิยมตลอดกาล ฟูลออปชันพร้อมกระสุนทอง',
    'Most Wanted M416 Skin with Custom Animations',
    7500, 5400000, 9000, 6500000,
    '["Progressive", "OriginalMail"]'::jsonb,
    'Master 120 LP', '1,890 ชม.', '1,890 hrs',
    'M416 Tiger Lv.8 | SLR Lv.3',
    'M416 Tiger Lv.8 | SLR Lv.3',
    'ไอดีเวียดนาม สกินยอดฮิต ส่งมอบเมลแรกแท้ 100%',
    'High tier M416 Roaring Tiger account with original mail.',
    'vn_tiger_pro', 'TigerSteam#2026', 'tiger_og@gmail.com | pass: TigerVn88',
    false, false, 'from-rose-950/40 to-slate-900'
)
ON CONFLICT (id) DO NOTHING;
