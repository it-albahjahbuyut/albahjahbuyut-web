# 🔒 Dokumentasi Keamanan - Al-Bahjah Buyut Website

## Ikhtisar

Website ini telah dilengkapi dengan berbagai lapisan keamanan untuk melindungi dari serangan umum seperti:
- **SQL Injection** - Serangan injeksi database
- **XSS (Cross-Site Scripting)** - Serangan injeksi skrip
- **DDoS (Distributed Denial of Service)** - Serangan untuk melumpuhkan server
- **Brute Force** - Serangan percobaan login berulang
- **CSRF (Cross-Site Request Forgery)** - Serangan pemalsuan permintaan

---

## 📊 Implementasi Keamanan

### 1. Perlindungan Admin Panel

| Fitur | Deskripsi |
|-------|-----------|
| **Middleware Protection** | Semua route `/admin/*` dilindungi dan memerlukan autentikasi |
| **Session Management** | Session JWT dengan masa berlaku 7 hari |
| **Secure Cookies** | Cookie httpOnly dengan flag `Secure` di production |
| **Role-Based Access** | Sistem role ADMIN dan SUPER_ADMIN |

### 2. Perlindungan DDoS & Rate Limiting

| Konfigurasi | Nilai | Deskripsi |
|-------------|-------|-----------|
| **Request Limit** | 100 req/menit | Limit request per IP per menit |
| **Login Attempts** | 5 percobaan/15 menit | Limit percobaan login |
| **PSB Form Limit** | 3 pendaftaran/jam | Limit pendaftaran PSB per IP |
| **Block Duration** | 1 jam | Durasi blokir setelah melebihi limit |
| **Suspicious Request Detection** | Aktif | Deteksi dan blokir tools hacking |
| **Upstash Redis** | ✅ Tersedia | Rate limiting distributed untuk multi-instance |

### 3. Perlindungan SQL Injection

| Lapisan | Metode |
|---------|--------|
| **Prisma ORM** | Parameterized queries otomatis |
| **Input Validation** | Zod schema dengan strict validation |
| **PSB Form Validation** | Validasi NIK (16 digit), No KK, nomor telepon Indonesia |
| **Slug Sanitization** | Regex pattern untuk slug yang aman |
| **Max Length Limits** | Pembatasan panjang input untuk mencegah DoS |

### 4. Security Headers

```
X-DNS-Prefetch-Control: on
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-XSS-Protection: 1; mode=block
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; ...
```

---

## 🔐 File Keamanan

| File | Fungsi |
|------|--------|
| `src/lib/security.ts` | Utility functions untuk rate limiting, sanitization, CSRF |
| `src/lib/rate-limit.ts` | **NEW** Upstash Redis distributed rate limiting |
| `src/lib/auth.ts` | Konfigurasi NextAuth dengan security enhancements |
| `src/lib/validations.ts` | Schema validasi dengan proteksi injection (termasuk PSB) |
| `src/lib/audit.ts` | Audit logging untuk tracking aktivitas admin |
| `src/lib/file-security.ts` | Validasi file upload untuk mencegah malicious files |
| `src/lib/password-policy.ts` | Password policy untuk enforce strong passwords |
| `src/lib/env.ts` | Environment variable validation |
| `src/components/security/honeypot.tsx` | Honeypot anti-spam untuk forms |
| `middleware.ts` | Rate limiting dan security headers |
| `next.config.ts` | Security headers configuration |

---

## 🆕 Fitur Keamanan Tambahan

### 5. Audit Logging
Semua aktivitas admin dicatat untuk monitoring keamanan:
- Login sukses/gagal
- CRUD operations (create, update, delete)
- Aktivitas mencurigakan

### 6. File Upload Security
Validasi file upload untuk mencegah:
- Malicious file uploads
- File type spoofing (double extension attack)
- Oversized files (DoS)
- Dangerous file extensions (.exe, .php, dll)

### 7. Password Policy
Enforce password yang kuat:
- Minimal 8 karakter
- Harus ada huruf kapital & kecil
- Harus ada angka
- Harus ada karakter khusus
- Blokir password umum (password123, admin, dll)

### 8. Honeypot Anti-Spam
Perlindungan form dari bot spam:
- Invisible honeypot field
- Timing-based detection
- Bot form filling detection

## ⚠️ Tools Hacking yang Diblokir Otomatis

Middleware akan otomatis memblokir request dari tools berikut:
- sqlmap
- nikto
- havij
- acunetix
- nessus
- burp suite
- masscan
- nmap

---

## 📋 Best Practices untuk Developer

### 1. Jangan pernah:
- Menggunakan raw SQL queries
- Menyimpan password dalam plain text
- Mengekspos error detail ke user
- Menonaktifkan validation

### 2. Selalu:
- Gunakan Prisma ORM untuk database operations
- Validasi semua input dengan Zod schema
- Log aktivitas mencurigakan
- Update dependencies secara regular

---

## 🚀 Konfigurasi Production

### Environment Variables yang Wajib:
```env
# Auth Secret (gunakan strong random string)
AUTH_SECRET="your-super-secret-key-minimum-32-characters"

# Database URL dengan SSL
DATABASE_URL="postgresql://...?sslmode=require"
```

### Rekomendasi Production:
1. **Gunakan Cloudflare atau WAF** - Perlindungan DDoS yang lebih kuat
2. **Enable HTTPS** - Wajib untuk cookie Secure
3. **Setup Monitoring** - Log dan alert untuk aktivitas mencurigakan
4. **Regular Backup** - Backup database secara berkala
5. ~~**Redis untuk Rate Limiting**~~ ✅ **Sudah diimplementasikan dengan Upstash Redis**

### Environment Variables Upstash (Wajib untuk Production):
```env
# Upstash Redis untuk distributed rate limiting
UPSTASH_REDIS_REST_URL="https://xxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="AXxxxxx"
```
Dapatkan credentials di: https://upstash.com (gratis tier tersedia)

---

## 📞 Reporting Security Issues

Jika menemukan masalah keamanan, hubungi:
- Email: security@albahjahbuyut.sch.id
- Jangan publikasikan kerentanan sebelum diperbaiki

---

## 📝 Changelog Keamanan

| Tanggal | Perubahan |
|---------|-----------|
| 2026-01-11 | **Upstash Redis integration** untuk distributed rate limiting |
| 2026-01-11 | **PSB Form Validation** dengan Zod schema (NIK, No KK, telepon) |
| 2026-01-06 | Implementasi rate limiting, security headers, dan input validation |
| 2026-01-06 | Enhanced authentication dengan timing attack protection |
| 2026-01-06 | Content Security Policy (CSP) implementation |
| 2026-01-06 | Environment variable protection dan validation |

---

## 🔐 Keamanan Environment Variables

### Bagaimana Next.js Melindungi Secrets?

Next.js secara otomatis melindungi environment variables:

| Prefix | Akses | Contoh |
|--------|-------|--------|
| **Tanpa prefix** | Server only | `DATABASE_URL`, `AUTH_SECRET` |
| **`NEXT_PUBLIC_`** | Client + Server | `NEXT_PUBLIC_APP_URL` |

### Variables yang Dilindungi (Tidak bisa dilihat via browser console):

```
DATABASE_URL          ✅ Tidak terekspos ke browser
AUTH_SECRET           ✅ Tidak terekspos ke browser
DIRECT_URL            ✅ Tidak terekspos ke browser
```

### Variables Public (By Design):

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME     ⚠️ Terekspos (diperlukan untuk upload widget)
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET  ⚠️ Terekspos (diperlukan untuk upload widget)
```

### Perlindungan Tambahan:

1. **Client-side Import Check** - db.ts akan error jika diimport di client
2. **Prefix Validation** - Memastikan DATABASE_URL tidak menggunakan NEXT_PUBLIC prefix
3. **Sensitive Pattern Detection** - Warning jika variable sensitif menggunakan NEXT_PUBLIC prefix

---

*Dokumen ini terakhir diupdate: 6 Januari 2026*
