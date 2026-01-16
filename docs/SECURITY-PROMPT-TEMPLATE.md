# 🔐 PROMPT KEAMANAN LENGKAP UNTUK NEXT.JS FULLSTACK

## 📋 Overview

Prompt ini berisi instruksi lengkap untuk mengimplementasikan keamanan enterprise-grade di aplikasi Next.js dengan perlindungan terhadap:
- SQL Injection
- XSS (Cross-Site Scripting)
- DDoS & Brute Force
- CSRF (Cross-Site Request Forgery)
- Credential Exposure
- Unauthorized Access
- Direct Database Access via curl/Postman

---

## 🚀 INSTRUKSI UNTUK AI (Copy & Paste ke Conversation Baru)

```
Saya ingin mengimplementasikan keamanan lengkap untuk aplikasi Next.js fullstack saya. Tolong bantu implementasi semua fitur keamanan berikut:

## A. ARSITEKTUR & ENVIRONMENT VARIABLES

### 1. Struktur .env yang Aman
- Semua secrets (DATABASE_URL, AUTH_SECRET, API_KEY) TIDAK boleh pakai prefix NEXT_PUBLIC_
- Hanya variable publik (cloud name, site URL) yang boleh NEXT_PUBLIC_
- Buat file .env.example sebagai template
- Pastikan .env ada di .gitignore

### 2. Validasi Environment Variables
- Buat file `src/lib/env.ts` yang:
  - Validasi semua required env vars ada
  - Cek tidak ada sensitive pattern di NEXT_PUBLIC_ vars
  - Throw error jika ada yang salah

### 3. Database Protection
- Buat file `src/lib/db.ts` yang:
  - Cek `typeof window !== 'undefined'` dan throw error jika di client
  - Validasi DATABASE_URL tidak pakai NEXT_PUBLIC_ prefix
  - Gunakan connection pooling untuk Supabase/PostgreSQL

## B. MIDDLEWARE SECURITY

### 4. Buat middleware.ts di root project dengan:

#### Rate Limiting:
- General API: 100 requests/menit per IP
- Login attempts: 5 attempts/15 menit per IP
- Block IP setelah terlalu banyak failed attempts (1 jam)
- Support in-memory fallback + Upstash Redis untuk production

#### Security Headers:
- X-DNS-Prefetch-Control: on
- Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
- X-XSS-Protection: 1; mode=block
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=()

#### Suspicious Request Detection:
- Block requests dengan User-Agent: sqlmap, nikto, burp, nmap, acunetix
- Block empty User-Agent

#### Route Protection:
- Semua route /admin/* harus authenticated
- Redirect ke /login jika belum login
- Rate limit /api/auth/callback/credentials endpoint

## C. AUTHENTICATION

### 5. Implementasi Auth dengan NextAuth/Auth.js:
- Gunakan credentials provider
- Hash password dengan bcrypt (salt rounds 10+)
- Session JWT dengan maxAge 7 hari
- Secure cookies di production (httpOnly, secure, sameSite strict)
- Timing attack protection saat login

### 6. Password Policy:
- Minimal 8 karakter
- Harus ada huruf kapital & kecil
- Harus ada angka
- Harus ada karakter khusus
- Block password umum (password123, admin123, dll)

## D. INPUT VALIDATION & SANITIZATION

### 7. Gunakan Zod untuk validasi:
- Semua form input harus di-validate
- String length limits untuk prevent DoS
- Email validation
- Slug sanitization (alphanumeric + hyphen only)
- NIK/phone number format validation jika ada

### 8. XSS Protection:
- Buat sanitizeInput() function yang:
  - Remove null bytes
  - Encode HTML entities (&, <, >, ", ')
  - Remove javascript: protocol
  - Remove event handlers (onclick, onmouseover, dll)
  - Block data: URLs

### 9. SQL Injection Protection:
- WAJIB gunakan ORM (Prisma/Drizzle) dengan parameterized queries
- JANGAN pernah string concatenation untuk SQL
- Validasi slug dengan regex [a-z0-9-]

## E. API ROUTE PROTECTION

### 10. Semua protected API routes harus:
- Check `const session = await auth();` di awal
- Return 401 jika tidak authenticated
- Validate request body dengan Zod schema
- Rate limited via middleware

### 11. Public API routes:
- Tetap rate limited
- Tidak return sensitive data
- Tidak expose database errors

## F. SERVER ACTIONS SECURITY

### 12. Semua server actions harus:
- Dimulai dengan "use server";
- Check authentication di awal
- Validate input dengan Zod
- Gunakan Prisma parameterized queries
- Tidak return sensitive error details

## G. SUPABASE-SPECIFIC (jika pakai Supabase)

### 13. Pilih salah satu arsitektur:
OPSI A - Prisma Direct (Recommended, lebih aman):
- Gunakan Prisma dengan DATABASE_URL langsung
- JANGAN pakai Supabase Client (@supabase/supabase-js)
- JANGAN expose SUPABASE_ANON_KEY
- RLS tidak wajib tapi recommended

OPSI B - Supabase Client:
- WAJIB enable Row Level Security (RLS) di SEMUA tabel
- Buat policies ketat untuk setiap tabel
- Restrict anon key access
- Jangan pernah expose service_role key

## H. FILE UPLOAD SECURITY

### 14. Validasi file upload:
- Whitelist file types (image/jpeg, image/png, application/pdf)
- Max file size limit (5MB recommended)
- Check file extension AND magic bytes
- Block dangerous extensions (.exe, .php, .js, dll)
- Generate random filename, jangan pakai original

## I. ADDITIONAL SECURITY

### 15. Audit Logging:
- Log semua login attempts (success/fail)
- Log admin actions (create, update, delete)
- Include IP address dan timestamp
- Store di database atau external service

### 16. Honeypot Anti-Spam:
- Tambahkan hidden field di form
- Jika field terisi, reject submission (bot detected)

### 17. CSRF Protection:
- Generate CSRF token per session
- Validate di form submission

## J. TESTING & VERIFICATION

### 18. Buat test script untuk verify:
- Credentials tidak ter-expose di browser console
- Admin routes redirect ke login
- API protected dengan auth
- Rate limiting bekerja
- SQL injection patterns diblokir
- XSS payloads di-sanitize
- Direct database access via curl terblokir

---

## Teknologi yang digunakan:
- Next.js 15 (App Router)
- TypeScript
- Prisma ORM
- PostgreSQL (Supabase)
- NextAuth/Auth.js v5
- Upstash Redis (rate limiting)
- Zod (validation)
- bcrypt (password hashing)

Tolong implementasikan semua fitur keamanan di atas step by step. Mulai dari environment setup, lalu middleware, authentication, kemudian input validation. Tunjukkan code lengkapnya.
```

---

## 📁 STRUKTUR FILE YANG HARUS DIBUAT

```
project/
├── .env                          # Secrets (JANGAN commit!)
├── .env.example                  # Template tanpa values
├── .gitignore                    # Include .env*
├── middleware.ts                 # Rate limit + security headers
├── SECURITY.md                   # Dokumentasi keamanan
├── prisma/
│   └── schema.prisma             # Database schema
├── scripts/
│   ├── security-check.js         # Script cek keamanan
│   └── enable-rls.sql            # Script RLS Supabase
└── src/
    ├── lib/
    │   ├── auth.ts               # NextAuth config
    │   ├── auth.config.ts        # Auth callbacks
    │   ├── db.ts                 # Prisma client + protection
    │   ├── env.ts                # Env validation
    │   ├── security.ts           # Rate limit + sanitization
    │   ├── rate-limit.ts         # Upstash Redis rate limiter
    │   ├── validations.ts        # Zod schemas
    │   ├── password-policy.ts    # Password validation
    │   ├── file-security.ts      # File upload validation
    │   └── audit.ts              # Audit logging
    ├── actions/
    │   ├── auth.ts               # Login/logout actions
    │   └── [feature].ts          # Feature-specific actions (with auth check)
    ├── app/
    │   ├── api/
    │   │   ├── auth/[...nextauth]/route.ts
    │   │   └── [feature]/route.ts # Protected API routes
    │   ├── login/page.tsx        # Login page
    │   ├── admin/                # Protected admin pages
    │   │   ├── layout.tsx        # Auth check wrapper
    │   │   └── page.tsx          # Dashboard
    │   └── (public)/             # Public pages
    └── components/
        └── security/
            └── honeypot.tsx      # Honeypot component
```

---

## 🔧 CHECKLIST KEAMANAN

### Environment & Config
- [ ] .env tidak di-commit ke Git
- [ ] .env.example ada sebagai template
- [ ] Semua secrets TIDAK pakai NEXT_PUBLIC_
- [ ] DATABASE_URL ada proteksi client-side check

### Authentication
- [ ] Password di-hash dengan bcrypt
- [ ] Session menggunakan JWT dengan maxAge
- [ ] Cookies httpOnly + secure di production
- [ ] Password policy enforced (8+ chars, uppercase, number, special)

### Rate Limiting
- [ ] Login rate limit: 5 attempts/15 minutes
- [ ] API rate limit: 100 requests/minute
- [ ] Block IP setelah terlalu banyak attempts
- [ ] Upstash Redis untuk distributed rate limiting

### Input Validation
- [ ] Semua input di-validate dengan Zod
- [ ] XSS payloads di-sanitize
- [ ] SQL injection tidak mungkin (Prisma parameterized)
- [ ] File upload di-validate (type + size)

### Route Protection
- [ ] Semua /admin/* routes require auth
- [ ] API routes check session
- [ ] Server actions check auth

### Security Headers
- [ ] HSTS enabled
- [ ] X-Frame-Options SAMEORIGIN
- [ ] X-Content-Type-Options nosniff
- [ ] CSP configured

### Database
- [ ] RLS enabled (jika pakai Supabase REST API)
- [ ] Tidak ada anon key exposed (jika pakai Prisma direct)
- [ ] Connection pooling configured

### Testing
- [ ] Test admin access tanpa login → redirect
- [ ] Test API tanpa auth → 401
- [ ] Test SQL injection payload → blocked/404
- [ ] Test brute force login → 429 rate limited
- [ ] Test curl ke database → 401/403
- [ ] Test browser console → no secrets exposed

---

## 📚 REFERENSI

- [Next.js Security](https://nextjs.org/docs/app/building-your-application/authentication)
- [Auth.js Documentation](https://authjs.dev/)
- [Prisma Security](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/connection-pooling)
- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [OWASP Top 10](https://owasp.org/Top10/)
- [Upstash Rate Limiting](https://upstash.com/docs/oss/sdks/ts/ratelimit/overview)

---

## 🚨 COMMON MISTAKES TO AVOID

1. ❌ `NEXT_PUBLIC_DATABASE_URL` → Database terexpose!
2. ❌ `NEXT_PUBLIC_SUPABASE_ANON_KEY` tanpa RLS → Data bocor!
3. ❌ Raw SQL queries dengan string concatenation → SQL Injection!
4. ❌ Tidak validate input dari user → XSS + Injection!
5. ❌ Tidak rate limit login → Brute force attack!
6. ❌ Return error.message ke client → Information disclosure!
7. ❌ Check auth di client side only → Bypass possible!
8. ❌ Store secrets di code → Git leak!

---

*Prompt ini dibuat berdasarkan implementasi keamanan di Al-Bahjah Buyut Website*
*Last updated: January 2026*
