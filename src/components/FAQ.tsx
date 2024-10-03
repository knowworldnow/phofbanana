import React from 'react';
import { FAQItem } from '../types';

interface FAQProps {
  faqItems: FAQItem[];
}

const FAQ: React.FC<FAQProps> = ({ faqItems }) => {
  if (!faqItems || faqItems.length === 0) {
    return null;
  }

  const sanitizeAnswer = (answer: string) => {
    // Remove the u00a0 artifacts and replace with spaces
    return answer.replace(/u00a0/g, ' ');
  };

  return (
    <section className="faq-section my-8">
      <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
      {faqItems.map((item, index) => (
        <details key={index} className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <summary className="font-semibold cursor-pointer">{item.question}</summary>
          <div 
            className="mt-2"
            dangerouslySetInnerHTML={{ __html: sanitizeAnswer(item.answer) }}
          />
        </details>
      ))}
    </section>
  );
};

export default FAQ;
