# 🚀 คู่มือการนำ SIMA Shop ขึ้นออนไลน์ (Production Deployment Guide)

ยินดีด้วยครับ! เว็บไซต์ **SIMA Shop - ตลาดซื้อขายไอดี PUBG PC (Steam)** ได้รับการพัฒนาและเตรียมพร้อมสำหรับการ Deploy ขึ้นออนไลน์ระดับ Production ครบทุกส่วนแล้ว

---

## 📑 สารบัญ
1. [ตัวเลือกการโฮสต์เว็บฟรี (Vercel / Cloudflare Pages)](#1-การ-deploy-ขึ้น-vercel-แนะนำ-ฟรี-100)
2. [การผูกชื่อโดเมนตัวเอง (Custom Domain เช่น simashop.com)](#2-การผูกชื่อโดเมนตัวเอง-custom-domain)
3. [การเปิดใช้งานฐานข้อมูลออนไลน์ Supabase (PostgreSQL)](#3-การเชื่อมต่อฐานข้อมูลออนไลน์-supabase)
4. [การตั้งค่าบัญชีรับเงิน PromptPay & VietQR เพื่อรับเงินจริง](#4-การตั้งค่าบัญชีรับเงินจริง)

---

## 1. การ Deploy ขึ้น Vercel (แนะนำ - ฟรี 100%)

Vercel เป็นโฮสติ้งยอดนิยมระดับโลกสำหรับ React ที่เร็วและเสถียรที่สุด มี SSL (HTTPS) ฟรีอัตโนมัติ

### ขั้นตอน:
1. นำโค้ดขึ้น **GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: SIMA Shop production release"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git
   git push -u origin main
   ```
2. สมัคร/เข้าสู่ระบบที่ [https://vercel.com](https://vercel.com) (ล็อกอินด้วยบัญชี GitHub ได้เลย)
3. คลิกปุ่ม **"Add New..."** &gt; **"Project"**
4. เลือก Repository ของคุณ แล้วกด **"Import"**
5. ในหน้าตั้งค่าโปรเจกต์:
   * **Root Directory:** ให้คลิก Edit แล้วเลือกโฟลเดอร์ `new-react-app`
   * **Framework Preset:** Create React App
   * **Build Command:** `npm run build` (ค่าเริ่มต้น)
   * **Output Directory:** `build` (ค่าเริ่มต้น)
6. กดปุ่ม **"Deploy"** รอประมาณ 1-2 นาที คุณจะได้ลิงก์เว็บไซต์ใช้งานได้จริงทันที เช่น `https://sima-shop.vercel.app` 🎉

*(ตัวโปรเจกต์มีไฟล์ `vercel.json` และ `_redirects` รองรับ SPA Routing เรียบร้อยแล้ว หน้าเว็บจะไม่เกิด 404 เมื่อกดรีเฟรช)*

---

## 2. การผูกชื่อโดเมนตัวเอง (Custom Domain)

หากคุณซื้อโดเมนไว้แล้ว (เช่น `simashop.com`, `simapubg.store` จาก Namecheap, GoDaddy, หรือ Cloudflare):

1. ในหน้าแดชบอร์ด Vercel ไปที่ **Settings** &gt; **Domains**
2. พิมพ์ชื่อโดเมนของคุณลงไป เช่น `simashop.com` แล้วกด **Add**
3. ไปที่ผู้ให้บริการโดเมนของคุณ แล้วเพิ่ม DNS Record ตามที่ Vercel ระบุ:
   * **Type A:** `@` ชี้ไปที่ `76.76.21.21`
   * **Type CNAME:** `www` ชี้ไปที่ `cname.vercel-dns.com`
4. รอระบบอัปเดต DNS ประมาณ 5-15 นาที เว็บไซต์ของคุณจะเข้าผ่านชื่อโดเมนจริง พร้อมกุญแจเขียว HTTPS ทันที!

---

## 3. การเชื่อมต่อฐานข้อมูลออนไลน์ Supabase

เพื่อให้ข้อมูลไอดี, ออเดอร์, สลิป และลูกค้าจากทุกอุปกรณ์ซิงก์ตรงกันแบบ Real-time:

1. สมัครใช้งานฟรีที่ [https://supabase.com](https://supabase.com)
2. กด **"New project"** ตั้งชื่อโปรเจกต์ เช่น `sima-shop` และตั้งรหัสผ่านฐานข้อมูล
3. เมื่อสร้างเสร็จ ไปที่เมนู **"SQL Editor"** แถบด้านซ้าย
4. เปิดไฟล์ [`supabase_schema.sql`](file:///f:/pubg_sell_id_vn/supabase_schema.sql) ในโปรเจกต์นี้ คัดลอกโค้ด SQL ทั้งหมดไปวางในช่อง แล้วกดปุ่ม **"Run"**
   *(คำสั่งนี้จะสร้างตาราง accounts, orders, users, store_settings และใส่ข้อมูลไอดีตัวอย่างให้ทันที)*
5. ไปที่ **Project Settings** (รูปเฟือง) &gt; **API**:
   * คัดลอก **Project URL** (เช่น `https://xyzcompany.supabase.co`)
   * คัดลอก **Project API keys (anon / public)**
6. เปิดหน้าเว็บ SIMA Shop ของคุณ เข้าเมนู **Admin** &gt; แถบ **"ตั้งค่าระบบ & Cloud DB"**:
   * วาง **Supabase Project URL**
   * วาง **Anon Public Key**
   * ติ๊กถูก **"เปิดใช้งาน Cloud Database"**
   * กด **"⚡ ทดสอบการเชื่อมต่อ Supabase"** และกด **"💾 บันทึกการตั้งค่า"**

---

## 4. การตั้งค่าบัญชีรับเงินจริง

เพื่อรับเงินจากลูกค้าทั้งไทยและเวียดนาม:

1. เข้าหน้า **Admin** &gt; แท็บ **"ตั้งค่าระบบ & ธนาคาร & Cloud DB"**
2. **สำหรับประเทศไทย 🇹🇭:**
   * **เบอร์พร้อมเพย์ (PromptPay ID):** ใส่เบอร์โทรศัพท์มือถือ หรือเลขประจำตัวผู้เสียภาษี/บัตร ปชช. ของคุณ
   * **ชื่อบัญชี:** ใส่ชื่อ-นามสกุล หรือชื่อร้านค้าของคุณ
3. **สำหรับประเทศเวียดนาม 🇻🇳:**
   * **VietQR Bank:** ใส่รหัสธนาคาร เช่น `MB` (MBBank), `VCB` (Vietcombank), `TCB` (Techcombank)
   * **เลขที่บัญชี:** ใส่เลขบัญชีธนาคารเวียดนามของคุณ
   * **ชื่อบัญชี:** ใส่ชื่อบัญชีภาษาเวียดนาม
4. กด **"💾 บันทึกการตั้งค่า"**

เมื่อลูกค้ากดซื้อไอดี ระบบจะคำนวณยอดเงินและสร้าง QR Code พร้อมเพย์ หรือ VietQR ที่มียอดเงินตรงเป๊ะทันที ลูกค้าสแกนโอนเงิน แนบสลิป แล้วรับรหัส Steam เข้าเล่นได้ทันที 24 ชม.! 🏆
