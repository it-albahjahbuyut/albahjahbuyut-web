# Product Specification Document: PSB Online Al-Bahjah Buyut

## 1. Overview
The **PSB Online Al-Bahjah Buyut** application is a web-based platform designed to facilitate the admission process for new students (santri) at Pondok Pesantren Al-Bahjah Buyut. It allows prospective students and guardians to view program information, register online, upload required documents, and check their registration status.

## 2. User User Journey
1.  **Discovery**: User views the Landing Page (Home) to learn about the institution.
2.  **Information**: User navigates to the **PSB (Penerimaan Santri Baru)** page to understand admission requirements, flow, and available units (SD, SMP, SMA).
3.  **Selection**: User selects a specific educational unit (e.g., SMPIQu).
4.  **Registration**: User fills out the multi-step registration form and uploads documents.
5.  **Submission**: User submits the form and receives a confirmation.
6.  **Tracking**: User checks the status of their registration (optional path).

## 3. Page Specifications & Testing Requirements

### 3.1. Home Page (`/`)
*   **Goal**: Provide general information and navigation to key sections.
*   **Key Sections to Test**:
    *   **Navbar**: Ensure links to Home, Profil, Pendidikan, Berita, Galeri, Infaq, and PSB work.
    *   **Hero Section**: consistent display of headline.
    *   **Public Info**: Profile, Programs, News, Features, Donation sections must render without error.
    *   **Footer**: Links and contact info visibility.

### 3.2. PSB Landing Page (`/psb`)
*   **Goal**: Explain the admission process and list available units.
*   **Key Elements**:
    *   **Hero**: "Penerimaan Santri Baru" title.
    *   **Status Check**: "Cek Status Pendaftaran" button links to `/psb/status`.
    *   **Flow Steps**: Display of 4 steps (Daftar, Pembayaran, Tes, Pengumuman).
    *   **Requirements List**: List of general requirements (FC KK, Akta, etc.).
    *   **Unit List**:
        *   Must verify at least one unit (e.g., SMPIQu or SMAIQu) is listed.
        *   **Action**: Clicking "Daftar" on a unit card must navigate to `/psb/daftar/[unit_slug]`.

### 3.3. Registration Form Page (`/psb/daftar/[unit]`)
*   **Goal**: Capture student data and documents.
*   **Target URL**: `/psb/daftar/smpiqu` (or valid unit slug).
*   **Key Components**:
    *   **Header**: Navigational back link "Kembali ke Pilihan Unit".
    *   **Form Container**: Multi-section form.
*   **Form Fields & Validation**:
    *   **Biodata Santri**:
        *   `Nama Lengkap`: Required, Text.
        *   `NISN`: Required, Numeric.
        *   `Tempat/Tanggal Lahir`: Required.
        *   `Jenis Kelamin`: Required (Laki-laki/Perempuan).
    *   **Data Orang Tua (Ayah & Ibu)**:
        *   `Nama`: Required.
        *   `NIK`: Required, Numeric.
        *   `Pekerjaan`: Dropdown/Text.
        *   `No. WA`: Required, Phone format.
    *   **Alamat**:
        *   `Alamat Lengkap`, `Desa`, `Kecamatan`, `Kabupaten`, `Provinsi`.
    *   **Berkas (Uploads)**:
        *   File inputs for Pas Foto, KK, Akta, etc.
        *   Validation: Max size check (if applicable), file type check (images/pdf).
*   **Submission Action**:
    *   Click "Daftar Sekarang" / Submit button.
    *   **Expected Result**:
        *   Show loading state.
        *   On success: Redirect to Success Page or show Success Message Overlay.
        *   On failure: Show validation errors inline.

### 3.4. Status Check Page (`/psb/status`)
*   **Goal**: User checks registration status using NIK/NISN.
*   **Input**: Search field for ID.
*   **Action**: Submit search.
*   **Output**: Display registration status card if found.

## 4. Testing Scenarios for TestSprite

### Scenario A: Full Registration Flow
1.  Open `/`.
2.  Click "PSB" in Navbar -> Navigates to `/psb`.
3.  Scroll to "Pilihan Jenjang".
4.  Click "Daftar" on "SMPIQu" card -> Navigates to `/psb/daftar/smpiqu`.
5.  Fill in all required inputs (using dummy data: "Test Siswa", NISN "1234567890", etc.).
6.  Upload dummy files for required documents.
7.  Click Submit.
8.  **Assertion**: "Pendaftaran Berhasil" message appears or redirect occurs.

### Scenario B: Navigation & Links
1.  Open `/`.
2.  Click through main navigation items (Profil, Berita, etc.).
3.  **Assertion**: No 404 errors encountered.

### Scenario C: Form Validation
1.  Open `/psb/daftar/smpiqu`.
2.  Click Submit without filling data.
3.  **Assertion**: Error messages "Wajib diisi" appear for required fields.
