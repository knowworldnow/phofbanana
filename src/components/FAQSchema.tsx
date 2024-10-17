import React from 'react';
import JsonLd from './JsonLd';
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

  return <JsonLd data={schemaData} />;
};

export default FAQSchema;
