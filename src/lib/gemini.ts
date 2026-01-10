import { GoogleGenAI } from "@google/genai";

// Initialize Gemini AI client
const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not configured");
    }
    return new GoogleGenAI({ apiKey });
};

// Available models to try (in order of preference)
const GEMINI_MODELS = [
    "gemini-2.5-flash",
    "gemini-2.0-flash-lite",
    "gemini-2.5-flash-lite",
];

export interface GeneratedCaption {
    slug: string;
    summary: string;
    content: string;
}

export interface GenerateCaptionParams {
    title: string;
    imageUrl?: string;
    type: "post" | "donation" | "gallery";
    category?: string;
}

/**
 * Sleep helper for retry logic
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generate caption content using Gemini AI based on title and image
 * Includes retry logic with model fallback
 */
export async function generateCaption(params: GenerateCaptionParams): Promise<GeneratedCaption> {
    const { title, imageUrl, type, category } = params;
    const ai = getGeminiClient();

    // Build the prompt based on content type
    let prompt = "";
    let contextDescription = "";

    switch (type) {
        case "post":
            contextDescription = category
                ? `artikel ${category.toLowerCase()} untuk website yayasan pendidikan Islam`
                : "artikel berita untuk website yayasan pendidikan Islam";
            prompt = `Kamu adalah penulis konten profesional untuk Yayasan Al-Bahjah Buyut, sebuah yayasan pendidikan Islam.

Berdasarkan judul "${title}"${imageUrl ? " dan gambar yang diberikan" : ""}, buatkan:

1. **slug**: URL-friendly slug dalam bahasa Indonesia (huruf kecil, tanpa spasi, gunakan strip sebagai pemisah, maksimal 50 karakter)

2. **summary**: Ringkasan singkat 2-3 kalimat yang menarik untuk ${contextDescription}

3. **content**: Konten artikel dalam format HTML yang TERSTRUKTUR RAPIH dengan ketentuan:

   WAJIB menggunakan format berikut:
   - Setiap paragraf HARUS dibungkus dengan tag <p>...</p>
   - Gunakan <h2> untuk sub-judul utama bagian artikel
   - Gunakan <h3> untuk sub-sub judul jika diperlukan
   - Gunakan <strong> untuk penekanan penting
   - Gunakan <em> untuk istilah Arab atau penekanan ringan
   - Gunakan <ul> dan <li> untuk daftar poin-poin
   - JANGAN menulis teks panjang dalam satu paragraf, pecah menjadi beberapa paragraf pendek (2-4 kalimat per paragraf)

   Struktur artikel:
   - Paragraf pembuka (pengantar topik)
   - 2-3 paragraf isi dengan sub-judul jika perlu
   - Paragraf penutup (kesimpulan/ajakan)

   Contoh format yang benar:
   <p>Paragraf pertama berisi pengantar...</p>
   <h2>Sub Judul Bagian</h2>
   <p>Paragraf kedua menjelaskan...</p>
   <p>Paragraf ketiga melanjutkan...</p>

Pastikan konten:
- Bernada positif dan inspiratif
- Sesuai dengan konteks pendidikan Islam
- Menggunakan bahasa Indonesia yang baik dan baku
- Informatif dan bermanfaat bagi pembaca
- RAPIH dan TERSTRUKTUR dengan paragraf-paragraf pendek

Berikan response dalam format JSON dengan struktur:
{
    "slug": "...",
    "summary": "...",
    "content": "..."
}`;
            break;

        case "donation":
            prompt = `Kamu adalah penulis konten profesional untuk Yayasan Al-Bahjah Buyut, sebuah yayasan pendidikan Islam.

Berdasarkan judul program donasi/infaq "${title}"${imageUrl ? " dan gambar yang diberikan" : ""}, buatkan:

1. **slug**: URL-friendly slug dalam bahasa Indonesia (huruf kecil, tanpa spasi, gunakan strip sebagai pemisah, maksimal 50 karakter)

2. **summary**: Deskripsi singkat 2-3 kalimat yang menyentuh hati dan mengajak orang untuk berinfaq

3. **content**: Deskripsi lengkap program donasi dalam format HTML yang TERSTRUKTUR RAPIH:

   WAJIB menggunakan format berikut:
   - Setiap paragraf HARUS dibungkus dengan tag <p>...</p>
   - Gunakan <h3> untuk sub-judul bagian jika diperlukan
   - Gunakan <strong> untuk penekanan penting
   - Gunakan <em> untuk istilah Arab atau dalil
   - JANGAN menulis teks panjang dalam satu paragraf, pecah menjadi paragraf pendek (2-3 kalimat per paragraf)

   Struktur deskripsi:
   - <p>Paragraf pembuka tentang program</p>
   - <p>Paragraf tentang tujuan dan manfaat</p>
   - <p>Paragraf tentang dampak positif</p>
   - <p>Paragraf ajakan dengan dalil/hadits jika relevan</p>

Pastikan konten:
- Menyentuh hati dan memotivasi untuk berdonasi
- Sesuai dengan nilai-nilai Islam tentang sedekah dan infaq
- Menggunakan bahasa Indonesia yang baik dan baku
- Menyebutkan dalil atau hadits yang relevan jika sesuai
- RAPIH dan TERSTRUKTUR dengan paragraf-paragraf pendek

Berikan response dalam format JSON dengan struktur:
{
    "slug": "...",
    "summary": "...",
    "content": "..."
}`;
            break;

        case "gallery":
            prompt = `Kamu adalah penulis konten profesional untuk Yayasan Al-Bahjah Buyut, sebuah yayasan pendidikan Islam.

Berdasarkan judul galeri "${title}"${imageUrl ? " dan gambar yang diberikan" : ""}, buatkan:

1. **slug**: URL-friendly slug dalam bahasa Indonesia (huruf kecil, tanpa spasi, gunakan strip sebagai pemisah, maksimal 50 karakter) - untuk referensi internal

2. **summary**: Deskripsi singkat 1-2 kalimat yang menjelaskan foto/gambar ini. Deskripsi harus jelas dan informatif.

3. **content**: Deskripsi lebih detail (2-3 kalimat) tentang momen atau kegiatan yang terekam dalam foto. Tulis dengan bahasa yang hidup dan menggambarkan suasana.

Pastikan deskripsi:
- Menggambarkan suasana dan kegiatan dengan baik
- Sesuai dengan konteks pendidikan Islam
- Menggunakan bahasa Indonesia yang baik dan baku
- Singkat, padat, dan jelas

Berikan response dalam format JSON dengan struktur:
{
    "slug": "...",
    "summary": "...",
    "content": "..."
}`;
            break;
    }

    // Prepare image data if available
    let imageData: { data: string; mimeType: string } | null = null;
    if (imageUrl) {
        try {
            const imageResponse = await fetch(imageUrl);
            if (imageResponse.ok) {
                const imageBuffer = await imageResponse.arrayBuffer();
                const base64Image = Buffer.from(imageBuffer).toString("base64");

                // Determine MIME type from URL or content-type header
                let mimeType = imageResponse.headers.get("content-type") || "image/jpeg";
                if (imageUrl.includes(".png")) mimeType = "image/png";
                else if (imageUrl.includes(".webp")) mimeType = "image/webp";
                else if (imageUrl.includes(".gif")) mimeType = "image/gif";

                imageData = { data: base64Image, mimeType };
            }
        } catch (error) {
            console.warn("Failed to fetch image for AI generation:", error);
            // Continue without image
        }
    }

    // Try each model with retry logic
    let lastError: Error | null = null;

    for (const model of GEMINI_MODELS) {
        try {
            console.log(`[AI] Trying model: ${model}`);

            let response;
            if (imageData) {
                // Use multimodal generation with image
                response = await ai.models.generateContent({
                    model,
                    contents: [
                        {
                            inlineData: {
                                data: imageData.data,
                                mimeType: imageData.mimeType,
                            },
                        },
                        prompt,
                    ],
                });
            } else {
                // Text-only generation
                response = await ai.models.generateContent({
                    model,
                    contents: prompt,
                });
            }

            // Extract text from response
            const text = response.text || "";

            // Parse JSON from response (handle markdown code blocks)
            let jsonStr = text;
            const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
            if (jsonMatch) {
                jsonStr = jsonMatch[1].trim();
            }

            // Try to parse the JSON
            const result = JSON.parse(jsonStr) as GeneratedCaption;

            console.log(`[AI] Successfully generated content with model: ${model}`);

            // Validate and clean the result
            return {
                slug: cleanSlug(result.slug, title),
                summary: result.summary || "",
                content: result.content || "",
            };
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            console.warn(`[AI] Model ${model} failed:`, lastError.message);

            // Check if it's a rate limit error
            if (lastError.message.includes("429") || lastError.message.includes("RESOURCE_EXHAUSTED")) {
                // Wait before trying next model
                console.log(`[AI] Rate limited, waiting 2 seconds before trying next model...`);
                await sleep(2000);
            }
        }
    }

    // If all models failed, throw a user-friendly error
    console.error("All Gemini models failed:", lastError);

    if (lastError?.message.includes("429") || lastError?.message.includes("RESOURCE_EXHAUSTED")) {
        throw new Error(
            "Quota API Gemini telah habis. Silakan tunggu beberapa saat dan coba lagi, atau hubungi admin untuk memeriksa billing API."
        );
    }

    throw new Error(
        lastError?.message || "Gagal generate konten dengan AI. Silakan coba lagi."
    );
}

/**
 * Clean and validate slug from AI response
 */
function cleanSlug(aiSlug: string | undefined, fallbackTitle: string): string {
    if (!aiSlug) {
        return generateFallbackSlug(fallbackTitle);
    }

    // Clean the slug
    let cleaned = aiSlug
        .toLowerCase()
        .trim()
        // Remove common prefixes AI might add
        .replace(/^(slug[:\-\s]*)/i, "")
        // Replace spaces and underscores with hyphens
        .replace(/[\s_]+/g, "-")
        // Remove all non-alphanumeric except hyphens
        .replace(/[^a-z0-9-]/g, "")
        // Remove multiple consecutive hyphens
        .replace(/-+/g, "-")
        // Remove leading/trailing hyphens
        .replace(/^-+|-+$/g, "")
        // Limit length
        .slice(0, 60);

    // If result is empty or too short, use fallback
    if (cleaned.length < 3) {
        return generateFallbackSlug(fallbackTitle);
    }

    return cleaned;
}

/**
 * Generate a fallback slug from title
 */
function generateFallbackSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 60)
        .trim();
}

