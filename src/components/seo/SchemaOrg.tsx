'use client';

import Script from 'next/script';

interface SchemaOrgProps {
  type?: 'Organization' | 'EducationalOrganization' | 'LocalBusiness' | 'Article' | 'BreadcrumbList';
  data?: Record<string, unknown>;
}

export function SchemaOrg({ type = 'EducationalOrganization', data }: SchemaOrgProps) {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': type,
  };

  const organizationSchema = {
    ...baseSchema,
    '@type': ['EducationalOrganization', 'LocalBusiness'],
    name: 'Pondok Pesantren Al-Bahjah Buyut',
    alternateName: ['Al-Bahjah Buyut', 'Pesantren Al-Bahjah Cirebon', 'PP Al-Bahjah Buyut'],
    description: 'Pondok Pesantren terbaik di Cirebon dengan program Tahfidz Al-Quran, SMPIQu, SMAIQu, dan Tafaqquh. Pesantren modern yang memadukan pendidikan Islam dan formal dengan bimbingan Buya Yahya.',
    url: 'https://albahjahbuyut.com',
    logo: 'https://albahjahbuyut.com/logo-buyut.png',
    image: 'https://albahjahbuyut.com/og-image.jpg',
    telephone: '+62-XXX-XXXX-XXXX', // Ganti dengan nomor telepon asli
    email: 'info@albahjahbuyut.com', // Ganti dengan email asli
    foundingDate: '2010', // Ganti dengan tahun pendirian asli
    founder: {
      '@type': 'Person',
      name: 'Buya Yahya',
      jobTitle: 'Pengasuh Pesantren',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Jl. Pesantren Al-Bahjah', // Ganti dengan alamat lengkap
      addressLocality: 'Cirebon',
      addressRegion: 'Jawa Barat',
      postalCode: '45100', // Ganti dengan kode pos asli
      addressCountry: 'ID',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -6.7063, // Ganti dengan koordinat asli
      longitude: 108.5570, // Ganti dengan koordinat asli
    },
    areaServed: [
      { '@type': 'City', name: 'Cirebon' },
      { '@type': 'State', name: 'Jawa Barat' },
      { '@type': 'Country', name: 'Indonesia' },
    ],
    sameAs: [
      'https://www.facebook.com/albahjahbuyut', // Ganti dengan link sosmed asli
      'https://www.instagram.com/albahjahbuyut',
      'https://www.youtube.com/@albahjahbuyut',
    ],
    priceRange: '$$',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Program Pendidikan',
      itemListElement: [
        {
          '@type': 'EducationalOccupationalProgram',
          name: 'Program Tahfidz Al-Quran',
          description: 'Program menghafal Al-Quran 30 Juz dengan metode terbaik',
          educationalCredentialAwarded: 'Hafidz Al-Quran',
        },
        {
          '@type': 'EducationalOccupationalProgram',
          name: 'SMPIQu (SMP Islam Qur\'ani)',
          description: 'Pendidikan menengah pertama berbasis Islam dan Al-Quran',
          educationalProgramMode: 'Full-time',
        },
        {
          '@type': 'EducationalOccupationalProgram',
          name: 'SMAIQu (SMA Islam Qur\'ani)',
          description: 'Pendidikan menengah atas berbasis Islam dan Al-Quran',
          educationalProgramMode: 'Full-time',
        },
        {
          '@type': 'EducationalOccupationalProgram',
          name: 'Program Tafaqquh',
          description: 'Program pendalaman ilmu agama dan kitab kuning',
        },
      ],
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '150',
      bestRating: '5',
      worstRating: '1',
    },
    ...data,
  };

  return (
    <Script
      id="schema-org"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(organizationSchema),
      }}
      strategy="afterInteractive"
    />
  );
}

// FAQ Schema for PSB pages
export function FAQSchema({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
      strategy="afterInteractive"
    />
  );
}

// Breadcrumb Schema
export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
      strategy="afterInteractive"
    />
  );
}
