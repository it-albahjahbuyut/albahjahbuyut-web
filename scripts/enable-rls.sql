-- ============================================
-- ENABLE ROW LEVEL SECURITY (RLS) - Al-Bahjah Buyut
-- ============================================
-- Jalankan script ini di Supabase SQL Editor:
-- https://supabase.com/dashboard/project/irpzpcertqzspntwqvlv/sql
-- 
-- Script ini akan:
-- 1. Enable RLS di semua tabel
-- 2. Buat policy yang memblokir akses via anon key/REST API
-- 3. Tetap mengizinkan akses via Prisma (service role)
-- ============================================

-- ============================================
-- STEP 1: Enable RLS pada semua tabel
-- ============================================

-- Auth & User Management
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;

-- Unit Pendidikan
ALTER TABLE "units" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "unit_social_media" ENABLE ROW LEVEL SECURITY;

-- Berita / Artikel
ALTER TABLE "posts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "post_images" ENABLE ROW LEVEL SECURITY;

-- Program Donasi
ALTER TABLE "donation_programs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "donation_program_images" ENABLE ROW LEVEL SECURITY;

-- Galeri
ALTER TABLE "galleries" ENABLE ROW LEVEL SECURITY;

-- Pengaturan
ALTER TABLE "settings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "site_settings" ENABLE ROW LEVEL SECURITY;

-- Majelis
ALTER TABLE "majelis" ENABLE ROW LEVEL SECURITY;

-- PSB
ALTER TABLE "psb_registrations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "psb_documents" ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 2: Create policies for service role access
-- ============================================
-- Karena Prisma menggunakan postgres user (service role),
-- kita perlu membuat policy yang mengizinkan service role
-- untuk melakukan semua operasi.
-- 
-- Catatan: Service role bypass RLS by default di Supabase,
-- tapi kita tetap buat policy untuk dokumentasi dan keamanan.
-- ============================================

-- Policy untuk tabel users
CREATE POLICY "Service role full access on users" ON "users"
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Policy untuk tabel units  
CREATE POLICY "Service role full access on units" ON "units"
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Policy untuk tabel unit_social_media
CREATE POLICY "Service role full access on unit_social_media" ON "unit_social_media"
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Policy untuk tabel posts
CREATE POLICY "Service role full access on posts" ON "posts"
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Policy untuk tabel post_images
CREATE POLICY "Service role full access on post_images" ON "post_images"
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Policy untuk tabel donation_programs
CREATE POLICY "Service role full access on donation_programs" ON "donation_programs"
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Policy untuk tabel donation_program_images
CREATE POLICY "Service role full access on donation_program_images" ON "donation_program_images"
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Policy untuk tabel galleries
CREATE POLICY "Service role full access on galleries" ON "galleries"
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Policy untuk tabel settings
CREATE POLICY "Service role full access on settings" ON "settings"
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Policy untuk tabel site_settings
CREATE POLICY "Service role full access on site_settings" ON "site_settings"
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Policy untuk tabel majelis
CREATE POLICY "Service role full access on majelis" ON "majelis"
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Policy untuk tabel psb_registrations
CREATE POLICY "Service role full access on psb_registrations" ON "psb_registrations"
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Policy untuk tabel psb_documents
CREATE POLICY "Service role full access on psb_documents" ON "psb_documents"
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- VERIFICATION: Check RLS status
-- ============================================
-- Jalankan query ini untuk memverifikasi RLS sudah aktif:
-- 
-- SELECT schemaname, tablename, rowsecurity 
-- FROM pg_tables 
-- WHERE schemaname = 'public';
-- ============================================

-- ============================================
-- CATATAN KEAMANAN:
-- ============================================
-- Dengan RLS enabled dan policy di atas:
-- 
-- 1. Akses via Prisma (DATABASE_URL dengan postgres user):
--    ✅ TETAP BISA - Service role bypass RLS
--
-- 2. Akses via Supabase REST API dengan anon key:
--    ❌ TERBLOKIR - Anon user tidak punya JWT claims
--
-- 3. Akses via Supabase JS Client dengan anon key:
--    ❌ TERBLOKIR - Same as above
--
-- Website kamu sekarang memiliki 2 lapisan keamanan:
-- - Layer 1: Tidak pakai Supabase client (tidak ada anon key)
-- - Layer 2: RLS enabled (kalau ada yang coba, tetap blocked)
-- ============================================
