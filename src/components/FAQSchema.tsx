import React from 'react';
import { FAQItem } from '../types';

interface FAQSchemaProps {
  faqItems: FAQItem[];
}

const FAQSchema: React.FC<FAQSchemaProps> = ({ faqItems }) => {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

export default FAQSchema;
