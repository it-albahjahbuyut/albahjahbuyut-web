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
    alternateName: ['Al-Bahjah Buyut', 'Pesantren Al-Bahjah Cirebon', 'PP Al-Bahjah Buyut', 'LPD Al-Bahjah Buyut'],
    description: 'Lembaga Pengembangan Dakwah (LPD) Al-Bahjah Buyut dibawah asuhan Buya Yahya & Abah Sayf Abu Hanifah. Mencetak generasi Qur\'ani yang berakhlak mulia, cerdas, dan mandiri melalui program Tahfidz Al-Quran, SMPIQu, SMAIQu, SDIQu, dan Tafaqquh.',
    url: 'https://albahjahbuyut.com',
    logo: 'https://albahjahbuyut.com/logo-buyut.png',
    image: 'https://albahjahbuyut.com/og-image.jpg',
    telephone: '+62-823-1861-1707',
    email: 'info@albahjahbuyut.com',
    foundingDate: '2015',
    founder: [
      {
        '@type': 'Person',
        name: 'Buya Yahya',
        jobTitle: 'Pengasuh LPD Al-Bahjah',
      },
      {
        '@type': 'Person',
        name: 'Abah Sayf Abu Hanifah',
        jobTitle: 'Pengasuh LPD Al-Bahjah Buyut',
      },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Jl. Revolusi No.45, Buyut',
      addressLocality: 'Gunungjati',
      addressRegion: 'Kabupaten Cirebon, Jawa Barat',
      postalCode: '45151',
      addressCountry: 'ID',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -6.650511,
      longitude: 108.508084,
    },
    areaServed: [
      { '@type': 'City', name: 'Cirebon' },
      { '@type': 'State', name: 'Jawa Barat' },
      { '@type': 'Country', name: 'Indonesia' },
    ],
    sameAs: [
      'https://www.facebook.com/ponpesalbahjah2',
      'https://www.instagram.com/abahsayfabuhanifah',
      'https://www.youtube.com/@ASAHTVOFFICIAL',
      'https://www.tiktok.com/@abahsayfabuhanifah',
    ],
    priceRange: '$$',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '07:00',
        closes: '16:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday'],
        opens: '07:00',
        closes: '12:00',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Program Pendidikan',
      itemListElement: [
        {
          '@type': 'EducationalOccupationalProgram',
          name: 'SDIQu (SD Islam Qur\'ani)',
          description: 'Pendidikan dasar berbasis Islam dan Al-Quran',
          educationalProgramMode: 'Full-time',
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
          name: 'Program Tahfidz Al-Quran',
          description: 'Program menghafal Al-Quran 30 Juz dengan metode terbaik',
          educationalCredentialAwarded: 'Hafidz Al-Quran',
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
