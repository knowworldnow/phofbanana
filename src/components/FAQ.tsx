import React from 'react';
import { FAQItem } from '../types';

interface FAQProps {
  faqItems: FAQItem[];
}

const FAQ: React.FC<FAQProps> = ({ faqItems }) => {
  return (
    <section className="faq-section my-8">
      <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
      {faqItems.map((item, index) => (
        <details key={index} className="mb-4 p-4 bg-gray-100 rounded-lg">
          <summary className="font-semibold cursor-pointer">{item.question}</summary>
          <div className="mt-2" dangerouslySetInnerHTML={{ __html: item.answer }} />
        </details>
      ))}
    </section>
  );
};

export default FAQ;
